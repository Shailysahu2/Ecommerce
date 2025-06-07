import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const user = new User({ email, password, name });
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get current user
  me: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: user.toJSON() });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};