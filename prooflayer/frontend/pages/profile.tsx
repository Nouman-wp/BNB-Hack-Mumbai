import React from 'react';

const Profile: React.FC = () => {
  // Dummy user data for now
  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    skills: ['Solidity', 'React', 'Node.js'],
    reputation: 1200,
  };
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <span className="font-semibold">Name:</span> {user.name}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Skills:</span> {user.skills.join(', ')}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Reputation:</span> {user.reputation}
      </div>
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit Profile</button>
    </div>
  );
};

export default Profile;
