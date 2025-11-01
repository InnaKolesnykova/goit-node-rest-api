import express from 'express';
import { verifyAgain, register, loginUser, logoutUser, getCurrentUser, updateAvatar, verifyEmail } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', loginUser);
authRouter.post('/verify', verifyAgain)
authRouter.get('/verify/:verificationToken', verifyEmail)
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, getCurrentUser);
authRouter.patch('/avatars', authMiddleware, updateAvatar);

export default authRouter;