import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            <main className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-bold mb-8 text-indigo-900">Welcome to ProofLayer</h1>
                <p className="text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
                    ProofLayer is a decentralized professional identity and reputation platform built on the BNB Smart Chain.
                    Connect your wallet and start proving your skills today!
                </p>
                <a 
                    href="/login"
                    className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Get Started
                </a>
            </main>
        </div>
    );
};

export default Home;