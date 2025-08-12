import React, { useState } from 'react';

const SubmitProof: React.FC = () => {
    const [github, setGithub] = useState('');
    const [blog, setBlog] = useState('');
    const [certificate, setCertificate] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');
        if (!github && !blog && !certificate) {
            setStatus('Please provide at least one link.');
            return;
        }
        setStatus('Proof submitted! (Demo only)');
        setGithub(''); setBlog(''); setCertificate('');
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">Submit Proof of Skills</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">GitHub Link</label>
                    <input type="url" className="w-full border rounded px-3 py-2" value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/your-repo" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Blog Link</label>
                    <input type="url" className="w-full border rounded px-3 py-2" value={blog} onChange={e => setBlog(e.target.value)} placeholder="https://yourblog.com/post" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Certificate Link</label>
                    <input type="url" className="w-full border rounded px-3 py-2" value={certificate} onChange={e => setCertificate(e.target.value)} placeholder="https://certificate.com" />
                </div>
                {status && <div className={status.includes('submitted') ? 'text-green-600' : 'text-red-500'}>{status}</div>}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Submit</button>
            </form>
        </div>
    );
};

export default SubmitProof;