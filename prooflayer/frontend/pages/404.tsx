import React from 'react';
import Link from 'next/link';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
    <p className="text-xl mb-6">Page Not Found</p>
    <Link href="/" className="text-blue-600 underline">Go Home</Link>
  </div>
);

export default NotFound;
