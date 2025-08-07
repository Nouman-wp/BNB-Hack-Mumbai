import React from 'react';

interface IdentityCardProps {
    userName: string;
    userSkills: string[];
    userReputation: number;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ userName, userSkills, userReputation }) => {
    return (
        <div className="identity-card">
            <h2>{userName}</h2>
            <h3>Skills:</h3>
            <ul>
                {userSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
            <h3>Reputation Score: {userReputation}</h3>
        </div>
    );
};

export default IdentityCard;