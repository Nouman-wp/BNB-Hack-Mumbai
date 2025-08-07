import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const authRouter = Router();
const authController = new AuthController();

export function setAuthRoutes(app: Router) {
    app.post('/api/auth/login', authController.login);
    app.post('/api/auth/register', authController.register);
}