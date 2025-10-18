import express from 'express';
import { register, loginUser, logoutUser, getCurrentUser, updateAvatar } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/avatarMiddleware.js'; // 👈 додай це

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, getCurrentUser);

authRouter.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);

export default authRouter;
