'use client';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains(
  [bscTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'ProofLayer',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
