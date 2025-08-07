import axios from 'axios';

class PinataClient {
    private apiKey: string;
    private apiSecret: string;
    private baseUrl: string;

    constructor(apiKey: string, apiSecret: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = 'https://api.pinata.cloud';
    }

    public async pinFileToIPFS(file: File): Promise<any> {
        const url = `${this.baseUrl}/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(url, formData, {
            maxRedirects: 0,
            headers: {
                'Content-Type': 'multipart/form-data',
                pinata_api_key: this.apiKey,
                pinata_secret_api_key: this.apiSecret,
            },
        });

        return response.data;
    }

    public async pinJSONToIPFS(json: object): Promise<any> {
        const url = `${this.baseUrl}/pinning/pinJSONToIPFS`;
        const response = await axios.post(url, json, {
            headers: {
                pinata_api_key: this.apiKey,
                pinata_secret_api_key: this.apiSecret,
            },
        });

        return response.data;
    }

    public async getPinList(): Promise<any> {
        const url = `${this.baseUrl}/data/pinList`;
        const response = await axios.get(url, {
            headers: {
                pinata_api_key: this.apiKey,
                pinata_secret_api_key: this.apiSecret,
            },
        });

        return response.data;
    }
}

export default PinataClient;