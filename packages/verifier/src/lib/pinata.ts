import pinataSDK from '@pinata/sdk';

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY_BASE || 'https://gateway.pinata.cloud/ipfs/';

if (!PINATA_JWT) {
  throw new Error('PINATA_JWT is not set in environment variables');
}

const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });

export async function pinJSONToIPFS(json: any, name: string): Promise<{ cid: string; url: string }> {
  const result = await pinata.pinJSONToIPFS(json, {
    pinataMetadata: { name },
  });
  return {
    cid: result.IpfsHash,
    url: `${PINATA_GATEWAY}${result.IpfsHash}`,
  };
}
