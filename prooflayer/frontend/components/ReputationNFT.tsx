import React from 'react';

interface ReputationNFTProps {
    nftId: string;
    title: string;
    description: string;
    imageUrl: string;
}

const ReputationNFT: React.FC<ReputationNFTProps> = ({ nftId, title, description, imageUrl }) => {
    return (
        <div className="reputation-nft">
            <img src={imageUrl} alt={title} className="nft-image" />
            <h3 className="nft-title">{title}</h3>
            <p className="nft-description">{description}</p>
            <p className="nft-id">NFT ID: {nftId}</p>
        </div>
    );
};

export default ReputationNFT;