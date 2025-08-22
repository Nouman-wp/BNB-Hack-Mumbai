import { Collection, Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/mongodb';
import { GitHubVerifier } from '../verifiers/github';
import { BlogVerifier } from '../verifiers/blog';
import { CertificateVerifier } from '../verifiers/certificate';
import type { Verifier, VerificationResult, VerificationCheck } from '../verifiers/types';
import { createProofPack } from '../lib/proofPack';
import { pinJSONToIPFS } from '../lib/pinata';

type ArtifactVerifier = GitHubVerifier | BlogVerifier | CertificateVerifier;

interface VerifierRun {
  _id: ObjectId;
  artifactId: ObjectId;
  status: 'running' | 'success' | 'failure';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  details?: {
    checks: VerificationCheck[];
    evidence: Record<string, any>;
    proofPackCid?: string;
    proofPackUrl?: string;
  };
}

interface Artifact {
  _id: ObjectId;
  owner: string;
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  updatedAt: Date;
  verifierRuns: VerifierRun[];
  proofPackCid?: string;
  proofPackUrl?: string;
}

type VerifierState = {
  status: 'running' | 'success' | 'failure';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  details?: {
    checks: VerificationCheck[];
    evidence: Record<string, any>;
    proofPackCid?: string;
    proofPackUrl?: string;
  };
};

export class VerifierService {
  private verifiers: Map<string, ArtifactVerifier>;
  private isProcessing: boolean;
  private db: Db | null;
  private artifacts: Collection<Artifact> | null;

  constructor() {
    this.verifiers = new Map<string, ArtifactVerifier>([
      ['github', new GitHubVerifier()],
      ['blog', new BlogVerifier()],
      ['certificate', new CertificateVerifier()],
    ]);
    this.isProcessing = false;
    this.db = null;
    this.artifacts = null;
  }

  private async ensureDbConnection(): Promise<void> {
    if (!this.db) {
      this.db = await connectToDatabase();
      this.artifacts = this.db.collection<Artifact>('artifacts');
    }
  }

  public async processArtifact(artifactId: ObjectId): Promise<boolean> {
    await this.ensureDbConnection();
    if (!this.artifacts) {
      throw new Error('Database connection failed');
    }
    
    // Get the artifact
    const artifact = await this.artifacts.findOne({ _id: artifactId });
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
      const verifierRun: VerifierRun = {
        _id: new ObjectId(),
        artifactId: artifact._id,
        status: 'running',
        startedAt: new Date(),
      };

      await this.artifacts.updateOne(
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

      let completedRun: VerifierRun;

      if (result.success) {
        // Generate and pin proof pack
        const proofPack = createProofPack({
          artifactId: artifact._id.toString(),
          owner: artifact.owner,
          url: artifact.url,
          type: artifact.type,
          verifiedAt: new Date().toISOString(),
          checks: result.checks.map(check => ({
            name: check.name,
            passed: check.result === 'pass',
            details: check.details
          })),
          evidence: result.evidence,
          verifierName: `prooflayer-${artifact.type}-verifier`,
          verifierVersion: '1.0.0',
        });

        // Pin to IPFS via Pinata
        const { cid, url: ipfsUrl } = await pinJSONToIPFS(
          proofPack,
          `proof-pack-${artifact._id}`
        );

        // Update verification run with results and IPFS details
        completedRun = {
          ...verifierRun,
          status: 'success',
          details: {
            checks: result.checks,
            evidence: result.evidence,
            proofPackCid: cid,
            proofPackUrl: ipfsUrl,
          },
          completedAt: new Date(),
        };

        // Update artifact status
        await this.artifacts.updateOne(
          { _id: artifact._id },
          {
            $set: {
              status: 'verified',
              proofPackCid: cid,
              proofPackUrl: ipfsUrl,
              updatedAt: new Date(),
            },
            $pull: { verifierRuns: { _id: verifierRun._id } },
            $push: { verifierRuns: completedRun }
          }
        );

        return true;
      } else {
        // Update verification run with failure results
        completedRun = {
          ...verifierRun,
          status: 'failure',
          details: {
            checks: result.checks,
            evidence: result.evidence,
          },
          error: result.error,
          completedAt: new Date(),
        };

        // Update artifact status
        await this.artifacts.updateOne(
          { _id: artifact._id },
          {
            $set: {
              status: 'rejected',
              updatedAt: new Date(),
            },
            $pull: { verifierRuns: { _id: verifierRun._id } },
            $push: { verifierRuns: completedRun }
          }
        );

        return false;
      }
    } catch (error) {
      // Log the error and update artifact
      console.error('Verification failed:', error);
      
      await this.artifacts.updateOne(
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

  public async startProcessing(intervalMs = 5000): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    await this.ensureDbConnection();
    if (!this.artifacts) {
      throw new Error('Database connection failed');
    }

    this.isProcessing = true;

    const processNext = async () => {
      try {
        // Find a pending artifact
        const artifact = await this.artifacts?.findOne({ status: 'pending' });
        if (artifact) {
          await this.processArtifact(artifact._id);
        }
      } catch (error) {
        console.error('Error processing artifact:', error);
      }

      // Schedule next run if still processing
      if (this.isProcessing) {
        setTimeout(processNext, intervalMs);
      }
    };

    // Start processing
    processNext();
  }

  public stopProcessing(): void {
    this.isProcessing = false;
  }
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

      let completedRun;

      if (result.success) {
        // Generate and pin proof pack
        const proofPack = createProofPack({
          artifactId: artifact._id.toString(),
          owner: artifact.owner,
          url: artifact.url,
          type: artifact.type,
          verifiedAt: new Date().toISOString(),
          checks: result.checks.map(check => ({
            name: check.name,
            passed: check.result === 'pass',
            details: check.details
          })),
          evidence: result.evidence,
          verifierName: `prooflayer-${artifact.type}-verifier`,
          verifierVersion: '1.0.0',
        });

        // Pin to IPFS via Pinata
        const { cid, url: ipfsUrl } = await pinJSONToIPFS(
          proofPack,
          `proof-pack-${artifact._id}`
        );

        // Update verification run with results and IPFS details
        completedRun = {
          ...verifierRun,
          status: 'success',
          details: {
            checks: result.checks,
            evidence: result.evidence,
            proofPackCid: cid,
            proofPackUrl: ipfsUrl,
          },
          completedAt: new Date(),
        };
      } else {
        // Update verification run with failure results
        completedRun = {
          ...verifierRun,
          status: 'failure',
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
