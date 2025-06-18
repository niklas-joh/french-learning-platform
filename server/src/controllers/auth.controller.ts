import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getInternalUserByEmail, UserApplicationData } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists using the public-facing getUserByEmail
    const existingUserPublic = await getUserByEmail(email);
    if (existingUserPublic) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // The createUser function expects 'password_hash', 'first_name', 'last_name'
    const createdUser: UserApplicationData = await createUser({
      email,
      password_hash: hashedPassword, // Use snake_case for DB model
      first_name: firstName,         // Use snake_case for DB model
      last_name: lastName,           // Use snake_case for DB model
      role: 'user'
    });

    // Generate JWT using data from UserApplicationData
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, role: createdUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { // Return UserApplicationData structure
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user internally to get password_hash
    const internalUser = await getInternalUserByEmail(email);

    if (!internalUser) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!internalUser.password_hash) {
        // This case should ideally not happen if user creation enforces password_hash
        console.error(`Critical: User ${internalUser.email} (ID: ${internalUser.id}) has no password_hash.`);
        res.status(500).json({ message: 'User account configuration error.' });
        return;
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, internalUser.password_hash);
    
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // User is valid, prepare application data for JWT and response
    const userForResponse: UserApplicationData = {
        id: internalUser.id!,
        email: internalUser.email,
        firstName: internalUser.first_name,
        lastName: internalUser.last_name,
        role: internalUser.role || 'user',
        createdAt: internalUser.created_at!,
        preferences: internalUser.preferences ? JSON.parse(internalUser.preferences) : null
    };

    // Generate JWT
    const token = jwt.sign(
      { userId: userForResponse.id, email: userForResponse.email, role: userForResponse.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { // Return UserApplicationData structure
        id: userForResponse.id,
        email: userForResponse.email,
        firstName: userForResponse.firstName,
        lastName: userForResponse.lastName,
        role: userForResponse.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
