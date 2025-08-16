'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold">ProofLayer</h1>
        <ConnectButton />
      </nav>

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Verifiable Builder Profiles on BNB Chain
        </h2>
        <p className="text-lg mb-8">
          Create portable, tamper-evident builder profiles backed by on-chain SBTs.
          Verify your work, mint proof badges, and showcase your achievements.
        </p>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/submit"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
          >
            Submit Proof
          </Link>
          <Link 
            href="/leaderboard"
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
          >
            View Leaderboard
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">GitHub Commits</h3>
            <p>Verify your contributions and development work</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Blog Posts</h3>
            <p>Showcase your technical writing and knowledge sharing</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Certificates</h3>
            <p>Add your achievements and credentials</p>
          </div>
        </div>
      </div>
    </main>
  );
}
