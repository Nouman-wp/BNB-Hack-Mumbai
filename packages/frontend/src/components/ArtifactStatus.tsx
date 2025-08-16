'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ArtifactStatus {
  id: string;
  status: 'pending' | 'verified' | 'rejected';
  type: string;
  url: string;
  note?: string;
  ipfsCid?: string;
  mintTxHash?: string;
  createdAt: string;
  updatedAt: string;
}

export function ArtifactStatus({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<ArtifactStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/artifacts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch status');
        
        const data = await res.json();
        setStatus(data);

        // If still pending, poll every 5 seconds
        if (data.status === 'pending') {
          setTimeout(() => checkStatus(), 5000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error checking status');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [id]);

  if (loading) {
    return (
      <div className="space-card p-6 animate-pulse">
        <div className="h-4 bg-space-purple/20 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-space-purple/20 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-card p-6 bg-red-500/10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="space-card p-6">
      <h2 className="text-xl font-semibold mb-4 nebula-text">
        Artifact Status
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-space-nebula">Status:</span>
          <span className={`px-2 py-1 rounded-full text-sm ${
            status.status === 'verified' ? 'bg-green-500/20 text-green-400' :
            status.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </span>
        </div>

        <div>
          <span className="text-space-nebula">Type:</span>
          <span className="ml-2">{status.type}</span>
        </div>

        <div>
          <span className="text-space-nebula">URL:</span>
          <a 
            href={status.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-space-accent hover:underline"
          >
            {status.url}
          </a>
        </div>

        {status.ipfsCid && (
          <div>
            <span className="text-space-nebula">Proof Pack:</span>
            <a 
              href={`https://gateway.pinata.cloud/ipfs/${status.ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-space-accent hover:underline"
            >
              View on IPFS
            </a>
          </div>
        )}

        {status.mintTxHash && (
          <div>
            <span className="text-space-nebula">NFT Transaction:</span>
            <a 
              href={`https://testnet.bscscan.com/tx/${status.mintTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-space-accent hover:underline"
            >
              View on BscScan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
