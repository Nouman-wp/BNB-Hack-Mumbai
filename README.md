
#  ProofLayer – Decentralized Reputation & Identity on BNB Chain

**ProofLayer** is the **most trustworthy and transparent professional social layer ever built**.  
It solves the **trust problem in professional networks** by creating a **cryptographically verifiable reputation system** based on **real contributions**.  

Unlike traditional platforms that rely on **self-declared credentials** or decentralized apps that only reward tokens, ProofLayer builds **tamper-proof professional profiles** by linking real work (code, blogs, certifications) to on-chain identity.

---

##  Key Features
- **Wallet-based Identity** → Sign in with Ethereum/BNB Chain (SIWE).  
- **Real Contribution Verification** → AI checks commit history, timestamps, blog metadata, and certificates.  
- **Decentralized Storage** → Verified proof packs stored on **IPFS (via Pinata)**.  
- **Reputation NFTs** → BEP-721 tokens represent verified achievements.  
- **Structured Reputation Data** → Indexed in **MongoDB (artifacts)** and **Supabase (scores, leaderboards)**.  
- **Frontend** → Modern **Next.js + Tailwind** with wallet integration.  
- **Backend** → Node.js microservices for AI verification & blockchain interactions.  

---

## 🛠 Tech Stack

### Blockchain
- **BNB Smart Chain Testnet**  
- Solidity + Hardhat + OpenZeppelin  
- BEP-721 NFTs for reputation  

### Storage
- **IPFS + Pinata** → Proof data & NFT metadata  

### Backend
- Node.js (Express or Fastify)  
- AI Verification (Node.js + optional Python microservices)  
- REST/GraphQL APIs  

### Databases
- **MongoDB Atlas** → Store raw artifacts & AI verification logs  
- **Supabase (Postgres)** → Store structured reputation scores, leaderboards, and provide realtime updates  

### Frontend
- Next.js + Tailwind CSS  
- Wagmi + RainbowKit for wallet connection  
- Vercel for hosting  

### Deployment
- Vercel (Frontend)  
- Railway / Fly.io (Backend)  
- MongoDB Atlas Cloud  
- Supabase Cloud  

---

---

## 🔑 Setup Instructions

### 1. Prerequisites

* Node.js v18+
* Hardhat
* MongoDB Atlas account
* Supabase project setup
* Pinata API keys
* MetaMask wallet on BNB Testnet

### 2. Install Dependencies

```bash
npm install
```


### 3. Run Services

* **Smart Contracts**: `npx hardhat run scripts/deploy.js --network bnbTestnet`
* **Backend API**: `npm run dev` in `/backend`
* **Frontend**: `npm run dev` in `/frontend`

---


##  Team

Built with ❤️ by hackers who believe in **trust-first professional networks**.
