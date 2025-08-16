import { z } from 'zod';

// Define environment schema
const envSchema = z.object({
  // BSC Testnet
  BSC_TESTNET_RPC_URL: z.string().url(),
  BSC_TESTNET_CHAIN_ID: z.string().or(z.number()).transform(val => Number(val)),

  // Wallet
  DEPLOYER_PRIVATE_KEY: z.string().min(64).max(66),

  // IPFS & Pinata
  PINATA_JWT: z.string(),
  PINATA_GATEWAY_BASE: z.string().url(),

  // MongoDB
  MONGODB_URI: z.string().url(),
  MONGODB_DB_NAME: z.string(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // GitHub
  GITHUB_TOKEN: z.string(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Admin
  ADMIN_WALLETS: z.string().transform(val => val.split(',').map(addr => addr.trim())),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    const config = envSchema.parse(process.env);
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => issue.path.join('.'));
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);
    }
    throw error;
  }
}

// Export constant for chain configuration
export const BSC_TESTNET = {
  id: 97,
  name: 'BSC Testnet',
  network: 'bsc-testnet',
  rpcUrls: {
    default: { http: [process.env.BSC_TESTNET_RPC_URL || ''] },
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
} as const;
