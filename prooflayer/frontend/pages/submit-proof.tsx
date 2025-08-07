import React, { useState } from 'react';
import ProofSubmissionForm from '../components/ProofSubmissionForm';

const SubmitProof = () => {
    const [submissionStatus, setSubmissionStatus] = useState('');

    const handleSubmission = async (data) => {
        try {
            const response = await fetch('/api/artifacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmissionStatus('Proof submitted successfully!');
            } else {
                setSubmissionStatus('Failed to submit proof. Please try again.');
            }
        } catch (error) {
            setSubmissionStatus('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Submit Proof of Skills</h1>
            <ProofSubmissionForm onSubmit={handleSubmission} />
            {submissionStatus && <p>{submissionStatus}</p>}
        </div>
    );
};

export default SubmitProof;