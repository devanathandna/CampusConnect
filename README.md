# CampusConnect Platform - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation Guide](#installation-guide)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Architecture Overview](#architecture-overview)
9. [Database Schema](#database-schema)
10. [Testing](#testing)

---

## 🎯 Project Overview

CampusConnect is a professional networking platform designed specifically for campus communities. It enables students, alumni, and faculty to connect, mentor, collaborate, and discover campus events in real-time.

### Key Features
- **Professional Networking**: LinkedIn-style profiles, connections, and skill endorsements
- **Smart Mentorship**: AI-driven mentor matching and structured mentorship programs
- **Event Management**: Centralized event calendar with RSVP and feedback systems
- **Real-time Messaging**: Instant messaging with Socket.IO
- **Dynamic News Feed**: Post updates, opportunities, and achievements
- **Advanced Search**: Elasticsearch-powered search across profiles and content
- **🎓 Collective Knowledge Hub** ⭐ NEW: Searchable repository of institutional wisdom where alumni and faculty share career advice, interview tips, and course guidance. Features full-text search, community voting, verification system, and contextual mentor linking

---

## 🛠 Technology Stack

### Frontend
- **React.js 18.x** - Component-based UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js 18.x** - JavaScript runtime
- **Express.js 4.x** - Web application framework
- **TypeScript 5.x** - Type-safe JavaScript
- **Socket.IO 4.x** - Real-time bidirectional communication

### Database
- **MongoDB 6.x** - NoSQL document database
- **Mongoose 7.x** - MongoDB object modeling (ODM)

### Authentication & Security
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **Helmet** - Security headers
- **cors** - Cross-Origin Resource Sharing

### Additional Tools
- **Redis** (Optional) - Session store and caching
- **Elasticsearch** (Optional) - Advanced search capabilities
- **Python FastAPI** (Optional) - AI/ML microservice for mentorship matching

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Required
- Node.js (v18.x or higher)
- npm or yarn
- MongoDB (v6.x or higher)

# Optional
- Redis (for production session management)
- Elasticsearch (for advanced search)
- Python 3.9+ (for AI/ML features)
```

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows, macOS, or Linux

---

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
# Create project directory
mkdir campusconnect
cd campusconnect

# Initialize project structure
mkdir -p backend frontend
```

### Step 2: Backend Setup

```bash
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express mongoose socket.io cors helmet compression dotenv
npm install passport passport-local express-session connect-mongo
npm install bcryptjs express-rate-limit

# Install TypeScript and types
npm install -D typescript @types/node @types/express @types/mongoose
npm install -D @types/passport @types/passport-local @types/bcryptjs
npm install -D @types/express-session @types/cors ts-node nodemon

# Create TypeScript configuration
npx tsc --init
```

### Step 3: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 4: Package.json Scripts

Update `package.json`:

```json
{
  "name": "campusconnect-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 5: Frontend Setup

```bash
cd ../frontend

# Create React app with TypeScript
npx create-react-app . --template typescript

# Install dependencies
npm install react-router-dom axios socket.io-client
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p
```

### Step 6: Tailwind Configuration

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      }
    },
  },
  plugins: [],
}
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/campusconnect

# Session
SESSION_SECRET=your-super-secret-session-key-change-in-production

# JWT (if implementing token-based auth)
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch (Optional)
ELASTICSEARCH_NODE=http://localhost:9200

# Email Service (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (Optional)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

Create `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🏃 Running the Application

### Start MongoDB

```bash
# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux (systemd)
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel or:
net start MongoDB
```

### Start Backend Server

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Expected output:
```
✅ Connected to MongoDB
Database: campusconnect

╔════════════════════════════════════════════════════════╗
║                                                        ║
║         🎓 CAMPUSCONNECT SERVER RUNNING 🎓            ║
║                                                        ║
║  Server:        http://localhost:5000                  ║
║  Environment:   development                            ║
║  Database:      Connected to MongoDB                   ║
║  Socket.IO:     Real-time communication enabled        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### Start Frontend Application

```bash
cd frontend

# Development mode
npm start
```

The application will open at `http://localhost:3000`

---

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "SecurePass123!",
  "role": "student",
  "profile": {
    "name": "John Doe",
    "major": "Computer Science",
    "graduationYear": "2025",
    "skills": ["JavaScript", "Python"],
    "interests": ["Web Development", "AI"]
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "64abc123..."
}
```

#### POST /api/auth/login
Authenticate user

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "64abc123...",
    "email": "student@university.edu",
    "role": "student",
    "profile": { ... }
  }
}
```

### User Management Endpoints

#### GET /api/users/:id
Get user profile

**Headers:**
```
Cookie: connect.sid=<session-id>
```

**Response:**
```json
{
  "user": {
    "_id": "64abc123...",
    "email": "student@university.edu",
    "role": "student",
    "profile": {
      "name": "John Doe",
      "avatar": "https://...",
      "bio": "...",
      "skills": ["JavaScript", "Python"],
      "interests": ["Web Development"]
    },
    "connections": [...],
    "endorsements": [...]
  }
}
```

#### GET /api/users/search?q=python&role=student
Search users

**Query Parameters:**
- `q` - Search query (searches name, skills, bio)
- `role` - Filter by role (student, alumni, faculty)
- `skills` - Filter by skills (comma-separated)
- `major` - Filter by major

### Connection Endpoints

#### POST /api/connections/request
Send connection request

**Request Body:**
```json
{
  "to": "64abc456...",
  "message": "I'd like to connect with you!"
}
```

#### PUT /api/connections/:id
Accept/reject connection

**Request Body:**
```json
{
  "status": "accepted"
}
```

### Event Endpoints

#### POST /api/events
Create new event

**Request Body:**
```json
{
  "title": "Tech Career Fair 2025",
  "description": "Meet top tech companies",
  "category": "Career",
  "startDate": "2025-10-15T09:00:00Z",
  "endDate": "2025-10-15T17:00:00Z",
  "location": "Main Campus",
  "maxAttendees": 100,
  "tags": ["career", "tech", "networking"]
}
```

#### GET /api/events?category=Career
Get events list

#### POST /api/events/:id/rsvp
RSVP to event

### Messaging Endpoints

#### POST /api/messages
Send message

**Request Body:**
```json
{
  "to": "64abc456...",
  "content": "Hello! Let's connect.",
  "attachments": []
}
```

#### GET /api/messages/:userId
Get conversation with specific user

### Mentorship Endpoints

#### POST /api/mentorship/request
Request mentorship

**Request Body:**
```json
{
  "mentor": "64abc789...",
  "topic": "Career Development",
  "description": "Looking for guidance on software engineering career path",
  "goals": ["Resume review", "Interview preparation"]
}
```

---

## 🏗 Architecture Overview

### System Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │ WebSocket
         │
┌────────▼────────┐
│  Express.js API │
│  (Port 5000)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│MongoDB│ │Socket.IO│
│       │ │ Server  │
└───────┘ └─────────┘
```

### Backend Structure

```
backend/
├── src/
│   ├── server.ts              # Main entry point
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── passport.ts        # Authentication config
│   ├── models/
│   │   ├── User.ts
│   │   ├── Connection.ts
│   │   ├── Event.ts
│   │   ├── Message.ts
│   │   ├── Post.ts
│   │   ├── Mentorship.ts
│   │   └── Notification.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── connections.ts
│   │   ├── events.ts
│   │   ├── messages.ts
│   │   ├── posts.ts
│   │   └── mentorship.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── emailService.ts
│   │   ├── notificationService.ts
│   │   └── searchService.ts
│   └── socket/
│       └── handlers.ts
├── .env
├── package.json
└── tsconfig.json
```

### Frontend Structure

```
frontend/
├── public/
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── events/
│   │   ├── messaging/
│   │   └── shared/
│   ├── services/
│   │   ├── api.ts
│   │   └── socket.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useSocket.ts
│   └── utils/
│       └── helpers.ts
├── .env
├── package.json
└── tailwind.config.js
```

---

## 💾 Database Schema

### Collections Overview

1. **users** - User profiles and authentication
2. **connections** - Connection requests and relationships
3. **events** - Campus events and RSVPs
4. **messages** - Direct messages between users
5. **posts** - News feed posts and updates
6. **mentorships** - Mentorship requests and programs
7. **notifications** - User notifications

### Indexes

```javascript
// Users
users.createIndex({ email: 1 }, { unique: true });
users.createIndex({ role: 1 });
users.createIndex({ "profile.name": "text", "profile.skills": "text" });

// Connections
connections.createIndex({ from: 1, to: 1 }, { unique: true });
connections.createIndex({ status: 1 });

// Events
events.createIndex({ startDate: 1, category: 1 });

// Messages
messages.createIndex({ conversationId: 1, createdAt: -1 });

// Notifications
notifications.createIndex({ user: 1, read: 1, createdAt: -1 });
```

---

## 🧪 Testing

### Unit Tests

```bash
# Install testing dependencies
npm install -D jest @types/jest ts-jest supertest @types/supertest

# Run tests
npm test
```

### Example Test

```typescript
import request from 'supertest';
import app from '../src/server';

describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@university.edu',
        password: 'Test123!',
        role: 'student',
        profile: { name: 'Test User' }
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });
});
```

---

## 📊 Performance Optimization

### Backend Optimizations

1. **Database Indexing**: All frequently queried fields are indexed
2. **Connection Pooling**: MongoDB connection pool size: 10
3. **Caching**: Redis caching for frequently accessed data
4. **Compression**: Gzip compression for API responses
5. **Rate Limiting**: 100 requests per 15 minutes per IP

### Frontend Optimizations

1. **Code Splitting**: React.lazy for route-based splitting
2. **Memoization**: React.memo for expensive components
3. **Virtual Scrolling**: For large lists (events, messages)
4. **Image Optimization**: Lazy loading and WebP format
5. **Service Workers**: Offline functionality

---

## 🔒 Security Best Practices

1. **Password Hashing**: bcrypt with salt rounds: 10
2. **Session Management**: Secure, HttpOnly cookies
3. **CORS**: Restricted to allowed origins
4. **Helmet**: Security headers enabled
5. **Input Validation**: All inputs sanitized
6. **Rate Limiting**: Protection against brute force
7. **HTTPS**: Required in production
8. **Environment Variables**: Sensitive data in .env

---

## 🚢 Deployment

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong SESSION_SECRET
- [ ] Enable HTTPS
- [ ] Set up MongoDB Atlas (cloud database)
- [ ] Configure Redis for sessions
- [ ] Set up Elasticsearch cluster
- [ ] Configure CDN for static assets
- [ ] Enable monitoring (PM2, New Relic)
- [ ] Set up logging (Winston, Loggly)
- [ ] Configure backup strategy

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create campusconnect-app

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret

# Deploy
git push heroku main
```

---

## 📞 Support & Documentation

- **GitHub**: [github.com/yourorg/campusconnect](https://github.com)
- **Documentation**: [docs.campusconnect.com](https://docs.campusconnect.com)
- **Email**: support@campusconnect.com

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for campus communities**