import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET');
}

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null; 
  }
};

export default { generateToken, verifyToken };
