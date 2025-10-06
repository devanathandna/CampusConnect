import express, { Request, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { isAuthenticated } from '../middleware/auth';
import User from '../models/User';
import { app } from '../server';

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, profile } = req.body;

    // Validation
    if (!email || !password || !role || !profile?.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      profile: {
        name: profile.name,
        avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: profile.bio || '',
        major: profile.major,
        graduationYear: profile.graduationYear,
        company: profile.company,
        department: profile.department,
        skills: profile.skills || [],
        interests: profile.interests || []
      }
    });

    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response, next: any) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      return res.json({ 
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    });
  })(req, res, next);
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
app.get('/api/auth/me', isAuthenticated, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});