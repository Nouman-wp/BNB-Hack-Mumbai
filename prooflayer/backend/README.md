# ProofLayer Backend Documentation

## Overview

The backend of the ProofLayer project is built using Node.js and Express. It serves as the API layer for the decentralized reputation and identity platform, handling requests related to user authentication, artifact management, and interactions with external services.

## Directory Structure

- **src/**: Contains the source code for the backend application.
  - **app.ts**: Entry point of the application, initializes the Express app and sets up middleware and routes.
  - **controllers/**: Contains controllers that handle incoming requests and responses.
    - **artifactController.ts**: Manages artifact-related requests.
    - **authController.ts**: Handles user authentication.
    - **userController.ts**: Manages user-related operations.
  - **routes/**: Defines the API routes and links them to the corresponding controllers.
    - **artifactRoutes.ts**: Routes for artifact-related endpoints.
    - **authRoutes.ts**: Routes for authentication-related endpoints.
    - **userRoutes.ts**: Routes for user-related endpoints.
  - **services/**: Contains services that interact with external APIs and perform business logic.
    - **aiService.ts**: Interacts with the AI engine for skill analysis.
    - **blockchainService.ts**: Interacts with the BNB Smart Chain for NFT minting and transaction status.
    - **ipfsService.ts**: Manages file uploads and retrievals from IPFS.
    - **nftService.ts**: Handles NFT management operations.
  - **models/**: Contains Mongoose models for database schemas.
    - **artifact.ts**: Schema for artifact documents.
    - **user.ts**: Schema for user documents.
  - **types/**: Contains TypeScript interfaces for the application.
    - **index.ts**: Defines interfaces for artifacts and users.

## Installation

1. Navigate to the backend directory:
   ```bash
   cd prooflayer/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the backend server, run the following command:

```bash
npm run dev
```

This will start the server in development mode, allowing you to test the API endpoints.

## API Endpoints

The backend exposes several API endpoints for interacting with the ProofLayer platform. Refer to the individual route files for detailed information on available endpoints and their usage.

## External Services

The backend interacts with several external services, including:

- **AI Engine**: For skill analysis and verification.
- **BNB Smart Chain**: For NFT minting and transaction management.
- **IPFS**: For decentralized file storage.

## Contributing

Contributions to the backend are welcome! Please follow the standard Git workflow for submitting changes and improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.