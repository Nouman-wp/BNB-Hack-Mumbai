import React, { useState } from 'react';

const ProofSubmissionForm = () => {
    const [githubLink, setGithubLink] = useState('');
    const [blogLink, setBlogLink] = useState('');
    const [certificateLink, setCertificateLink] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate input
        if (!githubLink && !blogLink && !certificateLink) {
            setError('Please provide at least one link.');
            return;
        }

        // Prepare data for submission
        const data = {
            githubLink,
            blogLink,
            certificateLink,
        };

        try {
            const response = await fetch('/api/artifacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit proof.');
            }

            setSuccess('Proof submitted successfully!');
            setGithubLink('');
            setBlogLink('');
            setCertificateLink('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Submit Proof of Skills</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>
                    GitHub Link:
                    <input
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Blog Link:
                    <input
                        type="url"
                        value={blogLink}
                        onChange={(e) => setBlogLink(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Certificate Link:
                    <input
                        type="url"
                        value={certificateLink}
                        onChange={(e) => setCertificateLink(e.target.value)}
                    />
                </label>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProofSubmissionForm;