// Canonical Proof Pack Schema and Types

export interface ProofPackEvidence {
  type: 'github' | 'blog' | 'certificate';
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
  evidence: Record<string, any>;
}

export interface ProofPack {
  version: string; // e.g. '1.0.0'
  artifactId: string;
  owner: string;
  url: string;
  type: 'github' | 'blog' | 'certificate';
  verifiedAt: string; // ISO date
  evidence: ProofPackEvidence;
  verifier: {
    name: string;
    version: string;
  };
}

// Utility to create a proof pack from verification result
export function createProofPack({
  artifactId,
  owner,
  url,
  type,
  verifiedAt,
  checks,
  evidence,
  verifierName,
  verifierVersion,
}: {
  artifactId: string;
  owner: string;
  url: string;
  type: 'github' | 'blog' | 'certificate';
  verifiedAt: string;
  checks: Array<{ name: string; passed: boolean; details?: string }>;
  evidence: Record<string, any>;
  verifierName: string;
  verifierVersion: string;
}): ProofPack {
  return {
    version: '1.0.0',
    artifactId,
    owner,
    url,
    type,
    verifiedAt,
    evidence: {
      type,
      checks,
      evidence,
    },
    verifier: {
      name: verifierName,
      version: verifierVersion,
    },
  };
}
