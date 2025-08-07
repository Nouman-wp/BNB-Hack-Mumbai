import React from 'react';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to ProofLayer</h1>
            <p>
                ProofLayer is a decentralized professional identity and reputation platform built on the BNB Smart Chain.
                Connect your wallet and start proving your skills today!
            </p>
            <a href="/login">Get Started</a>
        </div>
    );
};

export default Home;