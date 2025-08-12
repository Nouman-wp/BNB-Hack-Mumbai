import React from 'react';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link href="/">
        <span className="text-2xl font-bold text-blue-600 cursor-pointer">ProofLayer</span>
      </Link>
      <div className="space-x-6">
        <Link href="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link>
        <Link href="/submit-proof" className="hover:text-blue-600 font-medium">Submit Proof</Link>
        <Link href="/profile" className="hover:text-blue-600 font-medium">Profile</Link>
        <Link href="/login" className="hover:text-blue-600 font-medium">Login</Link>
      </div>
    </nav>
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">{children}</main>
    <footer className="bg-white text-center py-4 text-gray-500 border-t">&copy; {new Date().getFullYear()} ProofLayer. All rights reserved.</footer>
  </div>
);

export default Layout;
