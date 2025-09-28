import express from 'express';
import { register, loginUser, logoutUser, getCurrentUser } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, getCurrentUser);

export default authRouter;