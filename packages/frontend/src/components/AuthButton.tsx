'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSiweAuth } from '@/hooks/useSiweAuth';

export function AuthButton() {
  const { isConnected } = useAccount();
  const { signIn, loading, error } = useSiweAuth();

  const handleSignIn = async () => {
    const success = await signIn();
    if (success) {
      // Refresh the page or update UI state
      window.location.reload();
    }
  };

  return (
    <div>
      {!isConnected ? (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            return (
              <div
                {...(!mounted && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!mounted || !account || !chain) {
                    return (
                      <button onClick={openConnectModal} type="button" className="space-button">
                        Connect Wallet
                      </button>
                    );
                  }
                  return (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={openChainModal}
                        className="space-card px-4 py-2 text-sm"
                      >
                        {chain.hasIcon && (
                          <div className="mr-2">
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button onClick={openAccountModal} type="button" className="space-card px-4 py-2">
                        {account.displayName}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      ) : (
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="space-button disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
