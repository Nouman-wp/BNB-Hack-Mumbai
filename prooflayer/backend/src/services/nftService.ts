export class NFTService {
    private blockchainService: BlockchainService;

    constructor(blockchainService: BlockchainService) {
        this.blockchainService = blockchainService;
    }

    async createNFT(metadata: any): Promise<string> {
        // Logic to create an NFT using the blockchain service
        const nftId = await this.blockchainService.mintNFT(metadata);
        return nftId;
    }

    async getNFTDetails(nftId: string): Promise<any> {
        // Logic to retrieve NFT details from the blockchain
        const nftDetails = await this.blockchainService.getNFTDetails(nftId);
        return nftDetails;
    }

    async transferNFT(nftId: string, toAddress: string): Promise<void> {
        // Logic to transfer an NFT to another address
        await this.blockchainService.transferNFT(nftId, toAddress);
    }
}