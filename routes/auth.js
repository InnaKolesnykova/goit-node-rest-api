import express from 'express';
import { register, loginUser, logoutUser, getCurrentUser, updateAvatar } from '../controllers/userControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, getCurrentUser);
authRouter.patch('/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

authRouter.get('/avatars', (req, res) => {
  res.json({ message: 'Avatars route works!' });
});

export default authRouter;
