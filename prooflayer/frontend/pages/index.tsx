import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          Prove Your Skills on the <span className="text-blue-600">BNB Smart Chain</span>
        </h1>
        <p className="text-lg sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">
          ProofLayer is your decentralized professional identity and reputation platform. Verify your skills, build trust, and showcase your achievements with blockchain technology.
        </p>
        <a href="/dashboard" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow">
          Get Started
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-blue-600 text-4xl mb-2">🔗</div>
          <h3 className="text-xl font-semibold mb-2">Verify Skills</h3>
          <p className="text-gray-600 text-center">Submit your achievements, certifications, and project work for verification on the blockchain.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-blue-600 text-4xl mb-2">🌟</div>
          <h3 className="text-xl font-semibold mb-2">Build Reputation</h3>
          <p className="text-gray-600 text-center">Earn reputation tokens and build a verifiable track record of your professional growth.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-blue-600 text-4xl mb-2">🏆</div>
          <h3 className="text-xl font-semibold mb-2">Showcase Achievements</h3>
          <p className="text-gray-600 text-center">Display your verified skills and achievements through NFTs and on-chain credentials.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;