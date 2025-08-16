# ProjectGuide.md — ProofLayer (BNB Chain Testnet)

## 0) Project Overview

**Goal:** Create portable, tamper-evident builder profiles backed by on-chain SBTs (non-transferable NFTs) that reference IPFS-pinned, AI-verified proof packs of real work (commits, blogs, certificates).

**Core components**

* Smart contracts on **BNB Smart Chain Testnet** (chainId 97).
* **Next.js** frontend with wallet connect + SIWE.
* **Verifier service** (Node; optional Python OCR later).
* **IPFS + Pinata** for proof packs and NFT metadata.
* **MongoDB Atlas** for artifacts, logs, raw verification payloads.
* **Supabase (Postgres)** for scores, leaderboards, analytics, and realtime feeds.

---

## 1) Environments & Secrets

**Environments**

* Local development
* Staging (testnet)
* Production (testnet initially; mainnet later)

**Secrets to prepare (no values here; set them in your platform secret managers)**

* BSC RPC URL (testnet)
* Wallet private key for server-side minting
* Pinata JWT and gateway base
* MongoDB connection URI and database name
* Supabase URL, anon key, service role key
* GitHub token (read scopes)
* App base URL, NextAuth secret
* Admin wallet list (comma-separated)

**Acceptance criteria**

* All secrets exist in local env file(s) and in cloud secret managers for each environment.
* A short internal doc states where secrets live and who can rotate them.

**Copilot Agent prompt (paste in VS Code)**

> “Create a checklist to verify all required environment variables are present at app boot; fail fast with clear messages if any are missing.”

---

## 2) Product Requirements (MVP)

**User stories**

* As a builder, I can connect a wallet, sign in (SIWE), and submit a proof artifact (GitHub commit/repo, blog link, certificate link).
* The system verifies my artifact off-chain, writes a proof pack to IPFS, and marks it verified.
* I can mint a **soulbound badge** referencing the proof pack.
* My public profile shows my SBTs and verified artifacts.
* A leaderboard ranks addresses by score.

**Acceptance criteria**

* End-to-end flow works with GitHub commit URLs.
* Errors are shown clearly to users; server logs contain actionable details.

---

## 3) Repository & High-Level Structure

**Monorepo (conceptual)**

* Frontend app (Next.js; includes API routes for auth/mint)
* Smart contracts package (Hardhat)
* Verifier service (Node; optional Python OCR microservice later)
* Infra (deployment manifests, CI configs)

**Acceptance criteria**

* Single README at repo root explains how to run each part.
* CI runs lint/tests per workspace.

**Copilot Agent prompt**

> “Draft workspace package definitions and standard scripts for dev, build, test, and deploy across apps/services, without adding code.”

---

## 4) Smart Contracts (SBT on BSC Testnet)

**Goal**

* Deploy a non-transferable ERC-721 (SBT) with role-gated minting.
* Store tokenURI that points to metadata containing a link to the IPFS proof pack.

**Non-functional requirements**

* Transfers revert; only minting allowed.
* Admin role can grant/revoke minter role.
* Events emitted on mint.

**Acceptance criteria**

* Contract deployed on BSC Testnet.
* Transfer attempts fail; mint works; tokenURI returns metadata URL.
* Contract address recorded in project config for all environments.

**Copilot Agent prompt**

> “List unit tests the contract must pass to guarantee non-transferability and proper role-based minting. No code, just test cases and expected outcomes.”

---

## 5) Frontend (Next.js + Tailwind + Wallet Connect)

**Goal**

* Wallet connection for BSC Testnet (chainId 97).
* Global providers for Wagmi/RainbowKit.
* Public pages: home, submit artifact, profile, leaderboard.

**Key screens**

* Home: value prop, connect wallet, quick demo link.
* Submit: form with type (GitHub/blog/cert), URL, note; shows status.
* Profile (/u/\[address]): SBTs, artifact list, proof links.
* Leaderboard: top N addresses and scores.

**Accessibility & performance**

* Responsive, keyboard navigable, skeleton loaders.
* Avoid layout shift; render states for pending/verified/rejected.

**Acceptance criteria**

* Users can connect and see BSC Testnet network name.
* All pages render without errors on first load and refresh.

**Copilot Agent prompt**

> “Write a UX copy checklist for submit, profile, and leaderboard pages, covering empty states, loading states, and error states. No code.”

---

## 6) Auth (SIWE)

**Goal**

* Wallet-based sign-in using Sign-In With Ethereum (SIWE).
* Session reflects the connected address; server validates signatures.
* Session required to submit artifacts and mint.

**Security expectations**

* Nonces are single-use and short-lived.
* Session tokens are HTTP-only and bound to origin.

**Acceptance criteria**

* Sign-in flow succeeds; protected endpoints require valid session.
* Address mismatch blocked (connected vs. session).

**Copilot Agent prompt**

> “Outline the SIWE message fields and validation rules we must enforce (domain, uri, nonce, issuedAt, chainId, resources). No code.”

---

## 7) Data Model Strategy (MongoDB + Supabase)

**MongoDB (unstructured/semi-structured)**

* Collections: artifacts, proof\_packs, verifier\_runs.
* Artifact fields: owner (address), type, url, status (pending/verified/rejected), summary, raw payload, ipfsCid, timestamps.

**Supabase (structured analytics)**

* Tables: profiles (address, handles), reputation\_scores (address, score, updated\_at), leaderboard\_cache, events.
* Policies: read-only for public leaderboard; writes by server role.

**Acceptance criteria**

* Data dictionaries exist for each collection/table.
* Indexes defined (owner, status in MongoDB; address primary key in Postgres).

**Copilot Agent prompt**

> “Produce a data dictionary describing collections/tables, fields, types, and indexes; include retention/archival considerations. No code.”

---

## 8) Artifact Submission (API & UI)

**Flow**

* Authenticated user submits artifact with type + URL.
* Server validates format and ownership hints.
* Record created in MongoDB with status = pending.
* User sees item in their ‘My Submissions’ list.

**Acceptance criteria**

* Invalid URLs are rejected with clear messages.
* Submissions are idempotent by (owner, normalized URL) when possible.

**Copilot Agent prompt**

> “List validation rules per artifact type (GitHub commit/repo, blog post, certificate) and user-facing errors. No code.”

---

## 9) Verifier Service (Off-Chain AI & Rules)

**Scope (phase 1 rules-based)**

* GitHub: fetch commit/repo data, verify author/login, timestamps, repo visibility.
* Blog: fetch OpenGraph/RSS; verify author handle matches declared identity.
* Certificate: fetch asset, basic metadata checks (issuer domain, date). OCR later.

**Workflow**

* Poll MongoDB for pending artifacts.
* For each: run checks; compose a **proof pack** (normalized JSON).
* Pin proof pack to IPFS via Pinata → capture CID.
* Update artifact to verified or rejected with reason and CID.
* Write a verification event to Supabase (for analytics).

**Acceptance criteria**

* Verifier can be started/stopped independently.
* Each run produces an audit trail (inputs, decisions, outputs) in MongoDB.
* Rate limits and backoff for external APIs.

**Copilot Agent prompt**

> “Draft a rules spec for GitHub verification covering commit URL vs repo URL, authorship checks, timestamp sanity, and spoof prevention. No code.”

---

## 10) IPFS & Pinata (Proof Packs & Metadata)

**Goal**

* Store immutable proof packs and NFT metadata JSON on IPFS via Pinata.
* Record IPFS CIDs in MongoDB; store token metadata URI in contract.

**Acceptance criteria**

* Proof packs are reproducible, stable, and include a version field.
* Gateway links resolve; internal tool can re-download and validate a proof pack.

**Copilot Agent prompt**

> “Define the canonical proof-pack schema (top-level fields, nested evidence, versioning, and minimal required fields). No code.”

---

## 11) Minting Flow (SBT)

**Flow**

* User selects a verified artifact to mint a badge.
* Server pins NFT metadata that references the proof pack CID.
* Server (minter role) mints SBT to the user’s address.
* UI shows tx hash and minted status after confirmation.

**Acceptance criteria**

* Only verified artifacts can be minted.
* One badge per artifact (prevent duplicates or define rules for series).
* On-chain event captured and linked to user profile.

**Copilot Agent prompt**

> “Write a step list for server-side minting with pre-checks, metadata pinning, transaction submission, receipt handling, and error recovery. No code.”

---

## 12) Profile Pages

**Contents**

* Address header (optional ENS equivalent).
* SBTs owned (read tokenURI; render metadata).
* Verified artifacts with status chips and IPFS proof links.
* Copyable share link.

**Acceptance criteria**

* Profile loads even if wallet not connected (public view).
* Proof links open in new tab via gateway.

**Copilot Agent prompt**

> “Describe the profile component layout with sections, empty states, and loading placeholders. No code.”

---

## 13) Leaderboard (Supabase)

**Scoring (example weights—tune later)**

* GitHub commit/repo: 10
* Blog post: 6
* Certificate: 20
* Decay over time optional.

**Process**

* Scheduled job computes scores from MongoDB verified artifacts.
* Upsert into Supabase reputation\_scores.
* Public endpoint and page read from Supabase.

**Acceptance criteria**

* Deterministic score for a given snapshot.
* Pagination and basic anti-gaming sanity checks (rate caps).

**Copilot Agent prompt**

> “List SQL-level aggregates needed for leaderboard (total score, recent score, category breakdown) and the indexes to support them. No code.”

---

## 14) Admin & Moderation

**Admin tools**

* View latest submissions with filters.
* Force re-verify, reject with reason, or manually mint (for demos).
* Simple role gate via admin wallet list.

**Acceptance criteria**

* All admin actions are logged (who, when, what).
* Non-admins cannot access admin UI or endpoints.

**Copilot Agent prompt**

> “Produce an admin action checklist with preconditions, side effects, and logs required per action. No code.”

---

## 15) Security, Privacy, and Abuse Prevention

**Controls**

* SIWE nonce hygiene and short expiry.
* Server-side key isolation; no secrets in client.
* Rate limiting on submission and verification.
* GitHub API abuse prevention (backoff).
* Input sanitation for URLs; deny file uploads directly to server.
* Clear privacy note: public chain + public IPFS.

**Acceptance criteria**

* Automated checks run in CI for env var presence and unsafe config.
* Basic WAF or middleware rate limits enabled on public endpoints.

**Copilot Agent prompt**

> “Generate a threat model table (spoofed artifacts, stolen keys, spam submissions, metadata tampering) with mitigations and residual risk. No code.”

---

## 16) Observability & Quality

**Metrics**

* Time to verify
* Verification pass/fail counts by type
* Pinata success rate
* Mint success rate
* Leaderboard job duration

**Logs & traces**

* Structured logs with correlation IDs per artifact.
* Error aggregation in a dashboard.

**Acceptance criteria**

* One dashboard shows system health at a glance.
* Alerts for verifier stalls and rising failure rates.

**Copilot Agent prompt**

> “List key metrics, log fields, and alert thresholds for the verifier and minting flows. No code.”

---

## 17) CI/CD & Releases

**Pipelines**

* Lint/format/type checks for all packages.
* Contract tests on PR.
* Staging deploy on main merge; production on tagged releases.

**Manual runbooks**

* Contract redeploy procedure
* Index migration (Mongo/Supabase)
* Secret rotation steps

**Acceptance criteria**

* Reproducible builds and rollbacks.
* Change log per release with user-visible changes.

**Copilot Agent prompt**

> “Create a release checklist with pre-flight checks, smoke tests, and rollback plan. No code.”

---

## 18) E2E Runbook (Happy Path)

1. Connect wallet → SIWE sign-in.
2. Submit GitHub commit URL.
3. Verifier picks up artifact → validates → pins proof pack → marks verified.
4. User initiates mint → server pins metadata → mints SBT → tx confirmed.
5. Profile shows badge + proof; leaderboard reflects score on next job run.

**Acceptance criteria**

* Full flow finishes under a reasonable time budget for GitHub artifacts.
* All state transitions are visible to the user.

**Copilot Agent prompt**

> “Draft user-facing step states for the end-to-end flow (submitted, verifying, verified, minting, minted) with messages and recommended retry options. No code.”

---

## 19) Edge Cases & Future Work

**Edge cases**

* Private repos (require GitHub link-proof strategy later).
* Multi-author commits (resolve ownership attribution).
* Dead links or removed posts (revocation policy).
* Multiple SBTs per address vs single multi-proof SBT (design decision).

**Future**

* Python OCR service for certs.
* The Graph subgraph for on-chain indexing.
* Selective disclosure via Lit/Ceramic.
* Mainnet readiness (fees, RPC reliability).

**Acceptance criteria**

* Documented revocation or deprecation process for invalid proofs.
* Roadmap items have ballpark complexity and prerequisites listed.

**Copilot Agent prompt**

> “Outline a revocation policy for verified artifacts: when to revoke, how to notify, and how to reflect on-chain/off-chain. No code.”

---

## 20) Definition of Done (MVP)

* Contracts deployed and documented (address, ABI).
* Frontend connects wallets, supports SIWE, and submits artifacts.
* Verifier verifies GitHub artifacts and pins proof packs.
* Minting produces non-transferable badges referencing proof packs.
* Public profiles and leaderboard available.
* Monitoring dashboards and minimal alerts in place.
* Security checklist passed; secrets audited.

---

## 21) Glossary (quick)

* **SBT:** Soulbound Token; non-transferable ERC-721.
* **Proof pack:** Canonical JSON of verification evidence pinned to IPFS.
* **SIWE:** Sign-In With Ethereum; wallet-based auth.
* **CID:** Content Identifier for IPFS resources.

---

*End of ProjectGuide.md*
