import mongoose from 'mongoose';

interface IUser {
    walletAddress: string;
    username: string;
    email: string;
    skills: string[];
    reputationScore: number;
    createdAt: Date;
}

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    skills: [{
        type: String
    }],
    reputationScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model<IUser>('User', userSchema);
const User = mongoose.model('User', userSchema);

export default User;