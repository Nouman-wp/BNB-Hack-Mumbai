import { ObjectId } from 'mongodb';

export interface Artifact {
  _id: ObjectId;
  owner: string;              // Ethereum address
  type: 'github' | 'blog' | 'certificate';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  summary: string;
  rawPayload: Record<string, any>;
  ipfsCid?: string;          // IPFS CID of the proof pack
  mintTxHash?: string;       // Transaction hash of the SBT mint
  verifierRuns: VerifierRun[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VerifierRun {
  _id: ObjectId;
  artifactId: ObjectId;
  status: 'success' | 'failure';
  details: {
    checks: {
      name: string;
      success: boolean;
      message: string;
    }[];
    evidence: Record<string, any>;
  };
  error?: string;
  startedAt: Date;
  completedAt: Date;
}

export interface ProofPack {
  _id: ObjectId;
  artifactId: ObjectId;
  owner: string;
  type: Artifact['type'];
  version: string;
  content: {
    url: string;
    evidence: Record<string, any>;
    verification: {
      timestamp: Date;
      verifier: string;
      signature: string;
    };
  };
  ipfsCid: string;
  createdAt: Date;
}
