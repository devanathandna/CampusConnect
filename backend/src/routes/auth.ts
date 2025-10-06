import express, { Request, Response, Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { isAuthenticated } from '../middleware/auth';
import User from '../models/User';

const router: Router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, profile } = req.body;

    // Validation
    if (!email || !password || !role || !profile?.name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
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
        interests: profile.interests || [],
        location: profile.location
      },
      connections: [],
      endorsements: [],
      experience: [],
      education: [],
      gamification: {
        points: 0,
        level: 1,
        badges: [],
        stats: {
          eventsAttended: 0,
          connectionsAdded: 0,
          mentorshipHours: 0,
          skillsEndorsed: 0,
          postsCreated: 0
        }
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false
      },
      isActive: true,
      lastActive: new Date()
    });

    await user.save();

    // Auto login after registration
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Registration successful but login failed' });
      }
      
      const userResponse = {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        gamification: user.gamification,
        connections: user.connections,
        endorsements: user.endorsements,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

      return res.status(201).json({ 
        message: 'User registered successfully',
        user: userResponse,
        token: 'session-based-auth' // Placeholder for session-based auth
      });
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// Login
router.post('/login', (req: Request, res: Response, next: any) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Session login error:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      
      const userResponse = {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        gamification: user.gamification,
        connections: user.connections,
        endorsements: user.endorsements,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

      return res.json({ 
        message: 'Login successful',
        user: userResponse,
        token: 'session-based-auth' // Placeholder for session-based auth
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/me', isAuthenticated, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

export default router;