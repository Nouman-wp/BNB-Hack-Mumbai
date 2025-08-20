import dotenv from 'dotenv';
dotenv.config();

import { VerifierService } from './services/verifier';
import { Octokit } from '@octokit/rest';

// Initialize GitHub API client if token is present
if (process.env.GITHUB_TOKEN) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

// Create verifier service instance
const verifierService = new VerifierService();

// Start processing artifacts
console.log('Starting verifier service...');
verifierService.startProcessing().catch(console.error);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});
