# External Services Documentation

This directory contains the integration files for external services used in the ProofLayer project. Each service has its own dedicated folder with a client that handles interactions with the respective API.

## Services Overview

### AI Service
- **Path:** `ai/claudeClient.ts`
- **Description:** This client interacts with the Claude AI API to analyze skills and verify artifacts.

### Blockchain Service
- **Path:** `blockchain/bnbClient.ts`
- **Description:** This client provides methods for interacting with the BNB Smart Chain, including minting NFTs and checking transaction statuses.

### IPFS Service
- **Path:** `ipfs/pinataClient.ts`
- **Description:** This client handles interactions with the Pinata IPFS service for uploading and retrieving files.

## Usage
To use these services, import the respective client in your application code and utilize the provided methods to interact with the external APIs. Ensure that you have the necessary API keys and configurations set up as required by each service.