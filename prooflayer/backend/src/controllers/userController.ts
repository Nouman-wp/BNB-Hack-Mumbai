import { Request, Response } from 'express';
import UserService from '../services/userService';

export class UserController {
    private userService: typeof UserService;

    constructor() {
        this.userService = UserService;
    }

    public async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const userProfile = await this.userService.getUserProfile(userId);
            res.status(200).json(userProfile);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user profile', error });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await this.userService.updateUser(userId, userData);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    }
}

export default UserController;