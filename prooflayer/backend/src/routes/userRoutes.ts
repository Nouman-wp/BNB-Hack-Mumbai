import { Router } from 'express';
import UserController from '../controllers/userController';

const userController = new UserController();

export const setUserRoutes = (router: Router) => {
    router.get('/user/profile', userController.getUserProfile);
    router.put('/user/update', userController.updateUser);
};