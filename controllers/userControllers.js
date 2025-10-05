import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import fs from 'fs/promises'; 
import path from 'path';
import jimp from 'jimp';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import HttpError from "../helpers/HttpError.js";

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ 
      user: {
        email: user.email,
        subscription: user.subscription,
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      for (let field in error.errors) {
        return res.status(400).json({ message: `Missing required ${field} field` });
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "Email in use." });
    }

    res.status(500).json({ message: 'Error registering user', error });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: `Missing required ${!email ? 'email' : 'password'} field` });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const logoutUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updateAvatar = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatar = await jimp.read(file.path);
    await avatar.resize(250, 250);
    
    const avatarDir = path.join(__dirname, '../public/avatars');
    const avatarFilename = `${req.user.id}-${Date.now()}.jpg`;
    const finalAvatarPath = path.join(avatarDir, avatarFilename);
    
    await fs.mkdir(avatarDir, { recursive: true });

    await avatar.writeAsync(finalAvatarPath);

    await fs.unlink(file.path);

    const avatarURL = `/avatars/${avatarFilename}`;
    await User.findByIdAndUpdate(req.user.id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { register, loginUser, logoutUser, getCurrentUser, updateAvatar };