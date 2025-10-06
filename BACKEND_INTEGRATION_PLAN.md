# CampusConnect - Backend Integration Plan

## ✅ Completed

### 1. Authentication
- ✅ Created Register/Signup page (`Register.tsx`)
- ✅ Updated Login page to use real API
- ✅ Added switch between Login/Register in `App.tsx`
- ✅ Added error handling for login failures
- ✅ API service configured with proper endpoints

### 2. Environment Variables
- ✅ Fixed `import.meta.env` → `process.env.REACT_APP_*` for Create React App
- ✅ Created proper TypeScript definitions
- ✅ Backend `.env` configured with MongoDB connection (127.0.0.1 instead of localhost)

## 🔄 In Progress - Remove Mock Data & Connect to Real API

### Components to Update:

#### 1. **Dashboard.tsx** - Main Dashboard
**Current**: Uses mock data for everything
**Needs**:
- Remove all `useState` with hardcoded mock data
- Use `useEffect` to fetch data from API on mount
- Connect to real endpoints:
  - `api.getCurrentUser()` - Get logged-in user
  - `api.getPosts()` - Get feed posts
  - `api.getEvents()` - Get events
  - `api.getConnections()` - Get user connections
  - `api.getMentorships()` - Get mentorships

#### 2. **Feed.tsx** - News Feed
**Current**: Receives mock posts as props
**Needs**:
- `api.createPost()` - Create new post
- `api.likePost(postId)` - Like a post
- `api.commentOnPost(postId, comment)` - Add comment
- Real-time updates via Socket.IO

#### 3. **EventsList.tsx** - Events Page
**Current**: Mock events data
**Needs**:
- `api.getEvents()` - Fetch events
- `api.rsvpEvent(eventId)` - RSVP to event
- `api.createEvent()` - Create new event (if user has permission)
- Filter by category, date, attendance status

#### 4. **Network.tsx** - Connections
**Current**: Mock user list
**Needs**:
- `api.searchUsers(query)` - Search for users
- `api.sendConnectionRequest(userId)` - Send connection request
- `api.getConnections()` - Get current connections
- `api.endorseSkill(userId, skill)` - Endorse skills

#### 5. **Mentorship.tsx** - Mentorship Matching
**Current**: Mock mentor list
**Needs**:
- `api.getRecommendedMentors()` - Get AI-recommended mentors
- `api.requestMentorship(mentorId, topic)` - Request mentorship
- `api.getMentorships()` - Get active mentorships
- Connect to AI matching service

#### 6. **Profile.tsx** - User Profile
**Current**: Shows currentUser from props, edit doesn't save
**Needs**:
- `api.getCurrentUser()` OR `api.getUserById(userId)` - Fetch profile
- `api.updateProfile(userData)` - Save profile changes
- `api.getEndorsements(userId)` - Get skill endorsements
- Add/remove skills and interests

#### 7. **Messages.tsx** - Direct Messaging
**Current**: Mock conversations
**Needs**:
- `api.getConversations()` - Get message threads
- `api.sendMessage(toUserId, content)` - Send message
- Socket.IO for real-time messaging
- `socketService.onMessage()` - Listen for new messages

#### 8. **GroupsPage.tsx** - Groups
**Current**: Has mock data as fallback
**Needs**:
- Remove mock data entirely
- Use only `api.getGroups(filters)` - Already implemented
- `api.joinGroup(groupId)` - Already called
- Add error states for failed API calls

#### 9. **BadgeShowcase.tsx** - Gamification Badges
**Current**: Receives badges from props
**Needs**:
- `api.getCurrentUser()` - Get user's gamification data
- Display real badges from `user.gamification.badges`

#### 10. **Leaderboard.tsx** - Rankings
**Current**: Mock leaderboard data
**Needs**:
- `api.getLeaderboard(type)` - type: 'points' | 'connections' | 'events' | 'mentorship'
- Real-time updates

## 🚀 Backend API Routes Needed

### Priority 1 - Core Features
```typescript
// Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

// Users
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
GET    /api/users/search?q=query

// Posts
GET    /api/posts
POST   /api/posts
POST   /api/posts/:id/like
POST   /api/posts/:id/comment

// Events
GET    /api/events
POST   /api/events
POST   /api/events/:id/rsvp

// Connections
GET    /api/connections
POST   /api/connections/request
PUT    /api/connections/:id/accept
POST   /api/users/:id/endorse
```

### Priority 2 - Advanced Features
```typescript
// Mentorship
GET    /api/mentorship
POST   /api/mentorship/request
GET    /api/mentorship/recommended

// Messages
GET    /api/messages/conversations
GET    /api/messages/:conversationId
POST   /api/messages

// Groups
GET    /api/groups
POST   /api/groups
POST   /api/groups/:id/join

// Gamification
GET    /api/gamification/leaderboard
POST   /api/gamification/award-points

// Notifications
GET    /api/notifications
PUT    /api/notifications/:id/read
```

## 🔧 Implementation Steps

### Step 1: Update Dashboard (Central Hub)
1. Remove all mock data
2. Add loading states
3. Fetch real data on mount
4. Handle errors gracefully

### Step 2: Update Feed Component
1. Remove mock posts
2. Connect create post form
3. Add like/comment functionality
4. Add real-time updates

### Step 3: Update Events
1. Fetch real events
2. Add RSVP functionality
3. Add event creation
4. Filter and search

### Step 4: Update Network
1. Search users
2. Send connection requests
3. Show pending/accepted connections
4. Skill endorsements

### Step 5: Update Messaging
1. Real-time Socket.IO
2. Message history
3. Unread counts
4. Typing indicators

### Step 6: Polish & Testing
1. Loading skeletons
2. Error boundaries
3. Toast notifications
4. Mobile responsiveness

## 📝 Code Pattern to Follow

### Before (Mock Data):
```typescript
const [events, setEvents] = useState([
  { id: '1', title: 'Mock Event', ... }
]);
```

### After (Real API):
```typescript
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchEvents();
}, []);

if (loading) return <LoadingSkeleton />;
if (error) return <ErrorMessage message={error} />;
```

## 🎯 Next Immediate Actions

1. **Start Backend Server**: Ensure MongoDB is running and backend starts successfully
2. **Implement Auth Routes**: Register/Login endpoints in backend
3. **Test Authentication**: Verify register + login flow works end-to-end
4. **Update Dashboard**: Remove mock data, connect to real API
5. **Implement remaining endpoints** one by one

## 📊 Current Status

- **Frontend**: 90% complete (UI done, needs API connections)
- **Backend**: 60% complete (models done, need route implementations)
- **Auth System**: 80% complete (frontend ready, backend needs testing)
- **Real-time Features**: 20% complete (Socket.IO setup, needs handlers)

## ⚡ Quick Win Actions (Do These First)

1. ✅ Fix MongoDB connection (DONE - changed to 127.0.0.1)
2. ✅ Create Register page (DONE)
3. ✅ Update Login to use API (DONE)
4. 🔄 Test register/login flow
5. 🔄 Update Dashboard to fetch current user
6. 🔄 Implement basic feed with real posts
7. 🔄 Add create post functionality
8. 🔄 Connect events page

---

**Last Updated**: October 6, 2025
**Status**: Backend ready, frontend integration in progress
