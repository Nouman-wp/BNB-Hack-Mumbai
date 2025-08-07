class BNBClient {
    private provider: any;

    constructor(providerUrl: string) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    }

    async getBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return ethers.utils.formatEther(balance);
    }

    async sendTransaction(transaction: any): Promise<string> {
        const signer = this.provider.getSigner();
        const txResponse = await signer.sendTransaction(transaction);
        await txResponse.wait();
        return txResponse.hash;
    }

    async getTransactionStatus(txHash: string): Promise<any> {
        const txReceipt = await this.provider.getTransactionReceipt(txHash);
        return txReceipt;
    }
}