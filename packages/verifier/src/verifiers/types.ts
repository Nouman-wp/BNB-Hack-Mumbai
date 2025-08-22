import { ObjectId } from 'mongodb';

export interface VerificationResult {
  success: boolean;
  checks: VerificationCheck[];
  evidence: Record<string, any>;
  error?: string;
}

export interface VerificationCheck {
  name: string;
  result: 'pass' | 'fail';
  details?: string;
}

export interface VerifierContext {
  artifactId: ObjectId;
  owner: string;
  url: string;
}

export interface Verifier {
  type: 'github' | 'blog' | 'certificate';
  verify(context: VerifierContext): Promise<VerificationResult>;
}
