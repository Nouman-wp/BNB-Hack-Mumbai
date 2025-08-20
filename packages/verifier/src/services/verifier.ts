import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/mongodb';
import { GitHubVerifier } from '../verifiers/github';
import { BlogVerifier } from '../verifiers/blog';
import { CertificateVerifier } from '../verifiers/certificate';
import type { Verifier, VerificationResult } from '../verifiers/types';

type ArtifactVerifier = GitHubVerifier | BlogVerifier | CertificateVerifier;

export class VerifierService {
  private verifiers: Map<string, ArtifactVerifier>;

  constructor() {
    // Initialize verifiers
    this.verifiers = new Map<string, ArtifactVerifier>([
      ['github', new GitHubVerifier()],
      ['blog', new BlogVerifier()],
      ['certificate', new CertificateVerifier()],
    ]);
  }

  async processArtifact(artifactId: ObjectId): Promise<boolean> {
    const db = await connectToDatabase();
    const artifacts = db.collection('artifacts');
    
    // Get the artifact
    const artifact = await artifacts.findOne({ _id: artifactId });
    if (!artifact) {
      throw new Error('Artifact not found');
    }

    // Skip if already verified or rejected
    if (artifact.status !== 'pending') {
      return false;
    }

    // Get the appropriate verifier
    const verifier = this.verifiers.get(artifact.type);
    if (!verifier) {
      throw new Error(`No verifier found for type: ${artifact.type}`);
    }

    try {
      // Start verification run
      const verifierRun = {
        _id: new ObjectId(),
        artifactId: artifact._id,
        status: 'running' as const,
        startedAt: new Date(),
      };

      await artifacts.updateOne(
        { _id: artifact._id },
        { 
          $push: { verifierRuns: verifierRun },
          $set: { updatedAt: new Date() }
        }
      );

      // Run verification
      const result = await verifier.verify({
        artifactId: artifact._id,
        owner: artifact.owner,
        url: artifact.url,
      });

      // Update verification run with results
      const completedRun = {
        ...verifierRun,
        status: result.success ? 'success' : 'failure',
        details: {
          checks: result.checks,
          evidence: result.evidence,
        },
        error: result.error,
        completedAt: new Date(),
      };

      // Update artifact status
      await artifacts.updateOne(
        { _id: artifact._id },
        {
          $set: {
            status: result.success ? 'verified' : 'rejected',
            updatedAt: new Date(),
          },
          $pull: { verifierRuns: { _id: verifierRun._id } },
          $push: { verifierRuns: completedRun }
        }
      );

      return result.success;
    } catch (error) {
      // Log the error and update artifact
      console.error('Verification failed:', error);
      
      await artifacts.updateOne(
        { _id: artifact._id },
        {
          $set: {
            status: 'rejected',
            updatedAt: new Date(),
          },
          $push: {
            verifierRuns: {
              _id: new ObjectId(),
              artifactId: artifact._id,
              status: 'failure',
              error: error instanceof Error ? error.message : 'Unknown error',
              startedAt: new Date(),
              completedAt: new Date(),
            }
          }
        }
      );

      return false;
    }
  }

  // Process pending artifacts in a loop
  async startProcessing(intervalMs: number = 5000): Promise<void> {
    const db = await connectToDatabase();
    const artifacts = db.collection('artifacts');

    const processNext = async () => {
      try {
        // Find a pending artifact
        const artifact = await artifacts.findOne({ status: 'pending' });
        if (artifact) {
          await this.processArtifact(artifact._id);
        }
      } catch (error) {
        console.error('Error processing artifact:', error);
      }

      // Schedule next run
      setTimeout(processNext, intervalMs);
    };

    // Start processing
    processNext();
  }
}
