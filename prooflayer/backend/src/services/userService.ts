import { User } from '../models/user';

class UserService {
    async getUserById(userId: string) {
        try {
            return await User.findById(userId);
        } catch (error) {
            throw new Error('Error fetching user');
        }
    }

    async updateUser(userId: string, userData: any) {
        try {
            return await User.findByIdAndUpdate(userId, userData, { new: true });
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    async deleteUser(userId: string) {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error) {
            throw new Error('Error deleting user');
        }
    }

    async getAllUsers() {
        try {
            return await User.find();
        } catch (error) {
            throw new Error('Error fetching users');
        }
    }
}

export default new UserService();
