import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Dummy login logic
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Simulate login success
    alert('Logged in!');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account? <a href="#" className="text-blue-600 hover:underline">Register</a>
      </div>
    </div>
  );
};

export default Login;
