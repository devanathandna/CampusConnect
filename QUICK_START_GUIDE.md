# CampusConnect - Quick Start Guide
## Get Your Platform Running in 5 Minutes! 🚀

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ Node.js (v16 or higher)
- ✅ npm or yarn
- ✅ MongoDB (local or Atlas)
- ✅ VS Code (recommended)

---

## 🏃 Quick Start Steps

### **Step 1: Install Frontend Dependencies**

```bash
cd frontend
npm install
```

**Install these packages:**
```bash
npm install react react-dom react-router-dom
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom
npm install -D typescript @vitejs/plugin-react
```

### **Step 2: Install Backend Dependencies**

```bash
cd ../backend
npm install
```

**Install these packages:**
```bash
npm install express mongoose cors dotenv
npm install socket.io passport passport-jwt bcryptjs jsonwebtoken
npm install -D typescript @types/express @types/node @types/cors
npm install -D ts-node nodemon
```

### **Step 3: Environment Configuration**

Create `/frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Create `/backend/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/campusconnect
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development

# Optional: Email (for later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **Step 4: Start MongoDB**

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Add it to `MONGODB_URI` in `.env`

### **Step 5: Start the Backend**

```bash
cd backend
npm run dev
```

You should see:
```
✅ Server running on port 3000
✅ MongoDB connected successfully
```

### **Step 6: Start the Frontend**

In a new terminal:
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### **Step 7: Open the App**

Visit: **http://localhost:5173**

---

## 🎯 First Time Usage

### **Login to the Platform**

1. Enter any email (e.g., `student@university.edu`)
2. Enter any password (demo mode)
3. Select your role:
   - 🎓 **Student** - Current student
   - 💼 **Alumni** - Graduate
   - 📚 **Faculty** - Educator

4. Click **Sign In**

### **Explore the Features**

**Navigation Menu (Left Sidebar):**
1. 📈 **Feed** - See latest posts and updates
2. 👥 **My Network** - View and manage connections
3. 👨‍👩‍👧‍👦 **Groups** - Join or create groups
4. 📅 **Events** - Discover and RSVP to events
5. 🎯 **Mentorship** - Find mentors or mentees
6. 💬 **Messages** - Chat with connections
7. 🏆 **Leaderboard** - See top contributors
8. 🏅 **Badges** - View achievements
9. 👤 **Profile** - Edit your profile

---

## 🎨 Test All New Features

### **1. Groups System**

Click **Groups** → **Create Group**

**Try creating:**
- Computer Science Club (Type: Club, Public)
- Data Science Research (Type: Research, Private)
- Career Prep Group (Type: Career, Public)

**Features to test:**
- ✅ Search groups
- ✅ Filter by type
- ✅ Filter by privacy
- ✅ View trending groups
- ✅ Join a group
- ✅ Create new group with tags and rules

### **2. Leaderboard**

Click **Leaderboard**

**Test all 4 types:**
- 🏆 Points (overall contribution)
- ⭐ Connections (networking)
- 🎉 Events (attendance)
- 👨‍🏫 Mentorship (hours given)

**Check for:**
- ✅ Top 10 rankings
- ✅ Medal icons (1st, 2nd, 3rd place)
- ✅ Your rank display
- ✅ Smooth animations

### **3. Badges**

Click **Badges**

**See the badge collection:**
- ✅ Unlocked badges (with dates)
- ✅ Locked badges (with progress)
- ✅ Badge descriptions
- ✅ Beautiful cards with gradients

### **4. Enhanced UI**

**Check the new design:**
- ✅ Gradient backgrounds
- ✅ Smooth animations (fade-in, slide-up)
- ✅ Hover effects on cards
- ✅ Glass morphism effects
- ✅ Shadow and glow effects
- ✅ Responsive layout (resize window)

---

## 🔧 Development Commands

### **Frontend (Vite)**
```bash
npm run dev        # Start dev server (hot reload)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### **Backend (Express)**
```bash
npm run dev        # Start with nodemon (auto-restart)
npm run build      # Compile TypeScript
npm start          # Start production server
npm run lint       # Run ESLint
```

---

## 📁 Project Structure

```
campusconnect/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── events/         # Event components
│   │   │   ├── gamification/   # 🆕 Badges, Leaderboard
│   │   │   ├── groups/         # 🆕 Groups system
│   │   │   ├── messaging/      # Messages
│   │   │   ├── profile/        # User profile
│   │   │   └── shared/         # Header, Sidebar
│   │   ├── services/
│   │   │   ├── api.ts                      # 🆕 API service
│   │   │   ├── mentorshipMatching.ts       # 🆕 AI matching
│   │   │   └── eventRecommendation.ts      # 🆕 AI events
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript types
│   │   ├── App.tsx
│   │   ├── index.css           # Enhanced styles
│   │   └── main.tsx
│   ├── tailwind.config.js      # Enhanced config
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── models/             # Enhanced models
    │   │   ├── User.ts         # With gamification
    │   │   ├── Post.ts         # With opportunities
    │   │   ├── Event.ts
    │   │   ├── Mentorship.ts
    │   │   ├── Group.ts        # 🆕 Collaboration
    │   │   ├── Analytics.ts    # 🆕 Admin metrics
    │   │   └── SkillGap.ts     # 🆕 AI analysis
    │   ├── routes/
    │   ├── services/
    │   ├── middleware/
    │   └── server.ts
    └── package.json
```

---

## 🐛 Troubleshooting

### **Issue: Frontend won't start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Issue: Backend MongoDB connection failed**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### **Issue: Port already in use**
```bash
# Frontend (5173)
# Change in vite.config.ts:
server: { port: 3001 }

# Backend (3000)
# Change in .env:
PORT=4000
```

### **Issue: Tailwind styles not loading**
```bash
# Rebuild Tailwind
cd frontend
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

### **Issue: TypeScript errors**
```bash
# The CSS linter warnings are normal for Tailwind
# They don't affect functionality
# To suppress, add to settings.json:
"css.lint.unknownAtRules": "ignore"
```

---

## 🎯 Next Development Steps

### **Phase 1: Connect Backend API**
1. Implement auth routes in `/backend/src/routes/auth.routes.ts`
2. Implement user routes in `/backend/src/routes/user.routes.ts`
3. Test login/register with Postman
4. Connect Login component to real API

### **Phase 2: Real Data Flow**
1. Replace mock data in Dashboard
2. Implement post creation API
3. Implement event RSVP API
4. Implement group join API

### **Phase 3: AI Features**
1. Create mentorship matching endpoint
2. Create event recommendation endpoint
3. Create skill gap analysis endpoint

### **Phase 4: Polish**
1. Add loading skeletons
2. Add error boundaries
3. Add success/error toasts
4. Improve mobile responsiveness

---

## 📚 Useful Resources

### **Documentation:**
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- MongoDB: https://www.mongodb.com/docs
- Express: https://expressjs.com

### **Learning:**
- React Tutorial: https://react.dev/learn
- TypeScript Handbook: https://www.typescriptlang.org/docs
- MongoDB University: https://university.mongodb.com

---

## 💡 Pro Tips

1. **Use React DevTools**
   - Install browser extension
   - Inspect component props and state

2. **Use MongoDB Compass**
   - Visual interface for MongoDB
   - Download: https://www.mongodb.com/products/compass

3. **Use Postman**
   - Test API endpoints
   - Create collections for CampusConnect

4. **Hot Reload is Your Friend**
   - Both frontend and backend auto-reload
   - No need to restart manually

5. **Check the Console**
   - Frontend errors in browser console (F12)
   - Backend errors in terminal

---

## 🎉 You're All Set!

Your CampusConnect platform is now running with:
- ✅ Beautiful, modern UI
- ✅ 9 navigation pages
- ✅ Groups collaboration system
- ✅ Gamification (badges + leaderboard)
- ✅ AI-powered matching algorithms
- ✅ Comprehensive API service
- ✅ Enhanced design system

**Start coding and make it yours!** 🚀

---

## 🆘 Need Help?

**Common Questions:**
- "How do I add a new page?" → Create component, add to Dashboard.tsx, add to Sidebar.tsx
- "How do I call an API?" → Import `api` service, use `await api.methodName()`
- "How do I use the design system?" → Use className with `btn-primary`, `card`, etc.
- "How do I add animations?" → Use `animate-fade-in`, `animate-slide-up`, etc.

**File Structure Questions:**
- Frontend components: `/frontend/src/components/`
- Backend routes: `/backend/src/routes/`
- Types: `/frontend/src/types/index.ts`
- Styles: `/frontend/src/index.css`

**Happy Coding!** 🎊

---

*Last Updated: October 6, 2025*
*CampusConnect v1.0 - Professional Campus Networking Platform*
