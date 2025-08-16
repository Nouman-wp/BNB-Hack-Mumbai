'use client';

import { useCallback, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

export function useSiweAuth() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get nonce
      const nonceRes = await fetch('/api/auth/nonce');
      const { nonce } = await nonceRes.json();

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in to ProofLayer with Ethereum',
        uri: window.location.origin,
        version: '1',
        chainId: 97,
        nonce,
      });

      // 3. Sign message
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // 4. Verify signature
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        throw new Error('Verification failed');
      }

      return true;
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Sign in failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [address, signMessageAsync]);

  return {
    signIn,
    loading,
    error,
  };
}
