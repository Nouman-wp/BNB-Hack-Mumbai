export class IPFSService {
    private pinataApiKey: string;
    private pinataSecretApiKey: string;
    private pinataEndpoint: string;

    constructor() {
        this.pinataApiKey = process.env.PINATA_API_KEY || '';
        this.pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY || '';
        this.pinataEndpoint = 'https://api.pinata.cloud/pinning';
    }

    async uploadFile(file: Buffer, fileName: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', file, fileName);

        const response = await fetch(`${this.pinataEndpoint}/pinFileToIPFS`, {
            method: 'POST',
            headers: {
                pinata_api_key: this.pinataApiKey,
                pinata_secret_api_key: this.pinataSecretApiKey,
            },
            body: formData,
        });

        const data = await response.json();
        if (data.IpfsHash) {
            return data.IpfsHash;
        } else {
            throw new Error('File upload failed: ' + data.error);
        }
    }

    async retrieveFile(ipfsHash: string): Promise<Buffer> {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        if (!response.ok) {
            throw new Error('File retrieval failed: ' + response.statusText);
        }
        return await response.buffer();
    }
}