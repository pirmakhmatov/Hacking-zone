import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many login attempts, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

app.use('/api/auth/login', limiter);

// In-memory storage (temporary replacement for MongoDB)
let users = [];
let userIdCounter = 1;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hacking-zone-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    const existingUser = users.find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email or username',
        code: 'USER_EXISTS'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password: hashedPassword,
      rank: 'Recruit',
      xp: 0,
      level: 1,
      completedLevels: [],
      badges: [],
      lastLogin: new Date(),
      loginStreak: 0,
      createdAt: new Date()
    };

    users.push(newUser);

    const token = signToken(newUser.id);
    const userResponse = { ...newUser };
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'Agent profile created successfully! Welcome to Hacking-Zone.',
      token,
      data: {
        user: userResponse
      },
      code: 'AGENT_CREATED'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: 'SIGNUP_ERROR'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Please provide username and password',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const user = users.find(user => 
      user.email === username || user.username === username
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: 'Incorrect username or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const today = new Date().toDateString();
    const lastLogin = new Date(user.lastLogin).toDateString();
    
    if (today !== lastLogin) {
      user.loginStreak = today === new Date(user.lastLogin.getTime() + 86400000).toDateString() 
        ? user.loginStreak + 1 
        : 1;
      user.lastLogin = new Date();
    }

    const token = signToken(user.id);
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(200).json({
      status: 'success',
      message: 'Access granted! Welcome back, agent.',
      token,
      data: {
        user: userResponse
      },
      code: 'ACCESS_GRANTED'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: 'LOGIN_ERROR'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hacking-Zone backend is running!',
    usersCount: users.length
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hacking-Zone server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});