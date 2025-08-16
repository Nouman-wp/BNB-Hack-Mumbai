'use client';

import Link from 'next/link';
import { AuthButton } from './AuthButton';

export function Navigation() {
  return (
    <nav className="space-card z-10 backdrop-blur-md bg-space-purple/10 m-4 rounded-2xl">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold nebula-text">
            ProofLayer
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link 
              href="/submit"
              className="text-space-nebula hover:text-space-star transition-colors duration-300"
            >
              Submit
            </Link>
            <Link 
              href="/leaderboard"
              className="text-space-nebula hover:text-space-star transition-colors duration-300"
            >
              Leaderboard
            </Link>
          </div>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}
