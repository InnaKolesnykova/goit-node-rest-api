import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import fs from 'fs/promises';
import path from 'path';
import jimp from 'jimp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { nanoid } from 'nanoid';
import sgMail from '@sendgrid/mail';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user) => {
  const verificationUrl = `${process.env.BASE_URL}/users/verify/${user.verificationToken}`;

  const msg = {
    to: user.email,
    from: process.env.SENDER_EMAIL,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    await sendVerificationEmail(user);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
      message: 'User registered. Verification email sent.',
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
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!user.verify) {
      return res.status(401).json({ message: 'Email not verified. Please check your email for verification instructions.' });
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
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Not authorized" });

    user.token = null;
    await user.save();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Not authorized" });

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

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
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.verificationToken = null;
    user.verify = true;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyAgain = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Missing required field email' });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verify) return res.status(400).json({ message: 'Verification has already been passed' });

    await sendVerificationEmail(user);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  register,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  verifyEmail,
  verifyAgain
};
