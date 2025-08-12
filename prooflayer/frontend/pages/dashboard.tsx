import React from 'react';

const DashboardPage: React.FC = () => {
    // Dummy data for now
    const user = {
        name: 'Jane Doe',
        reputation: 1200,
        skills: ['Solidity', 'React', 'Node.js'],
        nfts: [
            { id: '1', title: 'Reputation NFT', description: 'Top Contributor', imageUrl: 'https://placehold.co/100x100' },
        ],
    };
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Reputation</h2>
                    <div className="text-4xl font-bold text-blue-600">{user.reputation}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    <ul className="flex flex-wrap gap-2">
                        {user.skills.map(skill => (
                            <li key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your NFTs</h2>
                <div className="flex gap-6">
                    {user.nfts.map(nft => (
                        <div key={nft.id} className="border rounded-lg p-4 flex flex-col items-center">
                            <img src={nft.imageUrl} alt={nft.title} className="w-20 h-20 mb-2 rounded" />
                            <div className="font-bold">{nft.title}</div>
                            <div className="text-sm text-gray-500">{nft.description}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-right">
                <a href="/submit-proof" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Submit New Proof</a>
            </div>
        </div>
    );
};

export default DashboardPage;