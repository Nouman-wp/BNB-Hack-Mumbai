
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProofLayer
 * @dev A BEP-721 contract to issue reputation NFTs based on verifiable work artifacts.
 */
contract ProofLayer is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    
    
    mapping(address => uint256[]) public userArtifacts;

    
    event ArtifactMinted(
        address indexed user,
        uint256 indexed tokenId,
        string ipfsURI,
        string artifactType
    );

    constructor() ERC721("ProofLayerNFT", "PLNFT") {}

    /**
     * @dev Mints a new NFT representing a verified artifact.
     * @param to Address of the user receiving the NFT
     * @param ipfsURI IPFS URI of the artifact metadata
     * @param artifactType Short descriptor (e.g., "GitHub", "Blog", "Certificate")
     */
    function mintArtifact(
        address to,
        string memory ipfsURI,
        string memory artifactType
    ) external onlyOwner {
        require(to != address(0), "Invalid recipient");

        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsURI);
        userArtifacts[to].push(tokenId);

        emit ArtifactMinted(to, tokenId, ipfsURI, artifactType);
        nextTokenId++;
    }

    /**
     * @dev Returns the list of artifact token IDs owned by a user.
     */
    function getUserArtifacts(address user) external view returns (uint256[] memory) {
        return userArtifacts[user];
    }

    
    function updateTokenURI(uint256 tokenId, string memory newURI) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _setTokenURI(tokenId, newURI);
    }
}
