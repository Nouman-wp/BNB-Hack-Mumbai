export interface Artifact {
    id: string;
    title: string;
    description: string;
    url: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    username: string;
    email: string;
    walletAddress: string;
    reputationScore: number;
    createdAt: Date;
    updatedAt: Date;
}