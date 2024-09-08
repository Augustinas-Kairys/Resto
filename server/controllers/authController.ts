import { Request, Response,NextFunction  } from 'express';
import mongoose from 'mongoose';
import User, { UserDocument } from '../models/User';

import path from "path";
import fs from "fs";

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import { generateToken, verifyToken, } from '../utils/jwtUtils';
import { sendEmail,sendPasswordResetEmail } from '../utils/emailUtils';




const generateTempPassword = (): string => {
  return crypto.randomBytes(12).toString('hex');
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const validRoles = ['user', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role: role || 'user'  
    });
    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString(), user.role || 'user');

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decodedToken = verifyToken(token) as { userId: string, role: string };
    const userId = decodedToken.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      id: user._id, 
      profilePicture: user.profilePicture,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role, 
    });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



  export const updateUserProfilePicture = async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
  
      const filePath = req.file.path;
  
      const filename = path.basename(filePath);
      console.log('Filename:', filename);
  
      user.profilePicture = filename;
  
      await user.save();
  
      res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const deleteProfilePicture = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId; 
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.profilePicture) {
        return res.status(404).json({ message: 'Profile picture not found' });
      }
  
      const filePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      fs.unlinkSync(filePath);
  
      await User.findByIdAndUpdate(userId, { $unset: { profilePicture: 1 }, $set: { profilePicture: undefined } });
  
      res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const decoded = verifyToken(token) as { userId: string; role: string };
    console.log('Decoded Token:', decoded);
    
    if (!decoded || decoded.role !== 'admin') {
      console.log('Role check failed');
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    req.params.userId = decoded.userId;
    next();
  };
  

  export const adminCreateUser = async (req: Request, res: Response) => {
    try {
      const { username, email, role } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const decodedToken = verifyToken(token);
      if (decodedToken.role !== 'admin') {
        return res
          .status(403)
          .json({ message: 'Forbidden: You do not have the required permissions' });
      }
  
      if (!username || !email || !role) {
        return res.status(400).json({ message: 'Username, email, and role are required' });
      }
  
      const validRoles = ['user', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin".' });
      }
  
      const normalizedEmail = email.toLowerCase();
  
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already in use' });
      }
  
      const existingUserByEmail = await User.findOne({ email: normalizedEmail });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const tempPassword = generateTempPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
      const newUser = new User({
        username,
        email: normalizedEmail, 
        password: hashedPassword,
        role,
      });
  
      await newUser.save();
      const newUserToken = generateToken(newUser._id.toString(), newUser.role);
  
      await sendEmail(normalizedEmail, tempPassword, newUserToken);
  
      res.status(201).json({
        message: 'User created successfully. An email has been sent with further instructions.',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const normalizedEmail = email.toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
      }
  
      const token = generateToken(user._id.toString(), 'reset_password');
  
      await sendPasswordResetEmail(normalizedEmail, token);
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error in forgot password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const resetPassword = async (req: Request, res: Response) => {
    try {
      const { password, token } = req.body;
  
      if (!password || !token) {
        return res.status(400).json({ message: 'Password and token are required' });
      }
  
      const decodedToken = verifyToken(token);
      if (!decodedToken || decodedToken.role !== 'reset_password') {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      
      const userId = decodedToken.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({  error: 'Internal server error' });
    }
  };
  

  export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { username, email, firstName, lastName, phoneNumber, profilePicture, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, firstName, lastName, phoneNumber, profilePicture, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

  export const completeRegistration = async (req: Request, res: Response) => {
    try {
      const { token, password, firstName, lastName, phoneNumber } = req.body;
  
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.password = await bcrypt.hash(password, 10);
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
  
      await user.save();
  
      res.status(200).json({ message: 'Registration completed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };