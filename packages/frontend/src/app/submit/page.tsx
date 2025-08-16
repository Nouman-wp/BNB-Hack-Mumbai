'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const artifactTypes = [
  {
    id: 'github',
    name: 'GitHub Commit/Repo',
    description: 'Submit a GitHub commit or repository URL',
    pattern: '^https://github\\.com/.+',
    placeholder: 'https://github.com/username/repo/commit/hash',
  },
  {
    id: 'blog',
    name: 'Blog Post',
    description: 'Submit a blog post or article URL',
    pattern: '^https?://.+',
    placeholder: 'https://yourblog.com/post',
  },
  {
    id: 'certificate',
    name: 'Certificate',
    description: 'Submit a certificate or credential URL',
    pattern: '^https?://.+',
    placeholder: 'https://credential.provider.com/cert/id',
  },
] as const;

type ArtifactType = typeof artifactTypes[number]['id'];

export default function SubmitPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [type, setType] = useState<ArtifactType>('github');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      router.push('/');
    }
  }, [address, router]);

  const selectedType = artifactTypes.find(t => t.id === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/artifacts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          url,
          note,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Submission failed');
      }

      const data = await res.json();
      router.push(`/artifacts/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit artifact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-card p-8">
        <h1 className="text-3xl font-bold mb-6 nebula-text">Submit Proof Artifact</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Artifact Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {artifactTypes.map((artifactType) => (
              <button
                key={artifactType.id}
                type="button"
                onClick={() => setType(artifactType.id)}
                className={`space-card text-left p-4 transition-all ${
                  type === artifactType.id ? 'ring-2 ring-space-accent' : ''
                }`}
              >
                <h3 className="font-semibold mb-2">{artifactType.name}</h3>
                <p className="text-sm text-space-nebula">{artifactType.description}</p>
              </button>
            ))}
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              {selectedType?.name} URL
            </label>
            <input
              id="url"
              type="url"
              pattern={selectedType?.pattern}
              placeholder={selectedType?.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full space-card bg-space-purple/20 px-4 py-2 rounded-lg focus:ring-2 focus:ring-space-accent"
              required
            />
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full space-card bg-space-purple/20 px-4 py-2 rounded-lg focus:ring-2 focus:ring-space-accent"
              rows={3}
              placeholder="Add any context or notes about this submission..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-4 space-card bg-red-500/10">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="space-button w-full"
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>
      </div>

      <div className="space-card p-6">
        <h2 className="text-xl font-semibold mb-4">Submission Guidelines</h2>
        <ul className="list-disc list-inside space-y-2 text-space-nebula">
          <li>Ensure the URL is publicly accessible</li>
          <li>For GitHub submissions, verify repository visibility</li>
          <li>Blog posts should be published and accessible</li>
          <li>Certificates must be from verifiable sources</li>
        </ul>
      </div>
    </div>
  );
}
