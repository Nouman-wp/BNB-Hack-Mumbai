# ProofLayer – Decentralized Reputation and Identity on BNB Chain

ProofLayer is a decentralized professional identity and reputation platform built on the BNB Smart Chain. It enables users to prove their real-world skills, contributions, and work history through verifiable artifacts like code commits, blog posts, event certificates, and more.

## 🚀 Why ProofLayer?

Traditional platforms like LinkedIn rely on self-reported data, making them vulnerable to inflated claims and bots. Most decentralized social apps focus on feeds or tokens but lack real verification. ProofLayer changes that by putting verifiable proof of work at the core of your identity.

## 🔍 What It Does

* Users connect their wallet via WalletConnect
* Submit GitHub links, blog articles, conference proof, or certificate URLs
* AI engine (Claude or GPT) verifies, analyzes, and extracts skill data
* Each artifact is pinned to IPFS using Pinata
* Reputation NFTs are minted on BNB Testnet via BEP 721 smart contracts
* Dashboard displays composite identity, skill graph, and contribution history

## 🧠 Features

* AI powered skill inference and reputation scoring
* NFT based proof of work for every verified artifact
* Decentralized metadata storage using IPFS
* Collateral staking and peer attestations for Sybil resistance
* Portable, tamper proof, and composable identity layer

## 🛠️ Tech Stack

* Frontend: Next.js + Tailwind CSS
* Backend: Node.js + Express
* AI: Claude REST API
* Blockchain: BNB Smart Chain Testnet, Hardhat, BEP 721
* Storage: IPFS via Pinata
* Database: MongoDB for artifact indexing, Supabase for session caching
* Auth: WalletConnect

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/yourusername/prooflayer.git
cd prooflayer
npm install
```

Start the dev server:

```bash
npm run dev
```

