# CampusConnect Frontend

A real-time professional networking platform for students, alumni, and faculty built with React, TypeScript, and Tailwind CSS.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.tsx              # Login component
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx          # Main dashboard container
│   │   │   ├── Feed.tsx               # Social feed component
│   │   │   ├── Network.tsx            # Network/connections component
│   │   │   └── Mentorship.tsx         # Mentorship matching component
│   │   ├── events/
│   │   │   └── EventsList.tsx         # Events listing component
│   │   ├── messaging/
│   │   │   └── Messages.tsx           # Real-time messaging component
│   │   ├── profile/
│   │   │   └── Profile.tsx            # User profile component
│   │   └── shared/
│   │       ├── Header.tsx             # Navigation header
│   │       └── Sidebar.tsx            # Sidebar navigation
│   ├── contexts/
│   │   ├── AuthContext.tsx            # Authentication context & provider
│   │   └── SocketContext.tsx          # Socket.IO context & provider
│   ├── hooks/
│   │   ├── useAuth.ts                 # Authentication hook
│   │   └── useSocket.ts               # Socket.IO hook
│   ├── services/
│   │   ├── api.ts                     # API service functions
│   │   └── socket.ts                  # Socket.IO service
│   ├── utils/
│   │   └── helpers.ts                 # Utility helper functions
│   ├── App.tsx                        # Root application component
│   ├── App.css                        # Application styles
│   └── index.tsx                      # Application entry point
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## ✨ Features

### Authentication
- Login with role-based access (Student, Alumni, Faculty)
- User profile management
- Session management

### Dashboard Views
1. **Feed** - Social feed with posts and updates
2. **Network** - Connect with students, alumni, and faculty
3. **Events** - Campus events and RSVP functionality
4. **Mentorship** - AI-powered mentor matching
5. **Messages** - Real-time messaging
6. **Profile** - User profile with skills and interests

### Core Components

#### Auth Components
- `Login.tsx` - User authentication interface

#### Dashboard Components
- `Dashboard.tsx` - Main dashboard container managing all views
- `Feed.tsx` - Post creation and feed display
- `Network.tsx` - User discovery and connection management
- `Mentorship.tsx` - Mentor search and request system

#### Event Components
- `EventsList.tsx` - Event browsing and RSVP

#### Messaging Components
- `Messages.tsx` - Chat interface with conversations list

#### Profile Components
- `Profile.tsx` - User profile editing and display

#### Shared Components
- `Header.tsx` - Top navigation with search and notifications
- `Sidebar.tsx` - Side navigation menu

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install additional packages (if not already installed):
```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📦 Dependencies

### Core Dependencies
- `react` - UI library
- `react-dom` - React DOM renderer
- `typescript` - Type safety
- `lucide-react` - Icon library

### Styling
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixing

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom color scheme:

- **Primary Color**: Blue (#3B82F6)
- **Secondary Color**: Purple (#8B5CF6)

Tailwind configuration is in `tailwind.config.js`.

## 🔌 API Integration

The frontend is structured to connect to a backend API. API endpoints are configured in `src/services/api.ts`:

- Base URL: `http://localhost:5000/api` (configurable via `.env`)
- Socket URL: `http://localhost:5000` (configurable via `.env`)

### Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📁 Key Files

### Context Providers

#### AuthContext.tsx
Manages user authentication state and provides:
- `user` - Current user object
- `login()` - Login function
- `logout()` - Logout function
- `updateUser()` - Update user data

#### SocketContext.tsx
Manages WebSocket connections for real-time features:
- `socket` - Socket instance
- `connected` - Connection status
- `emit()` - Send events
- `on()` - Listen to events

### Services

#### api.ts
Provides API methods for:
- Authentication (`authAPI`)
- Users (`userAPI`)
- Connections (`connectionAPI`)
- Events (`eventAPI`)
- Messages (`messageAPI`)
- Posts (`postAPI`)
- Mentorship (`mentorshipAPI`)

#### socket.ts
Socket.IO client service with methods for:
- Real-time notifications
- Live messaging
- Connection requests
- Event updates

### Utilities

#### helpers.ts
Utility functions including:
- Date/time formatting
- Text manipulation
- Validation
- Avatar generation
- Debouncing

## 🧪 Demo Mode

The application includes a demo mode for testing:
- Enter any email and password to log in
- All features are simulated without backend
- Sample data is pre-populated

## 🔧 Development

### Type Safety
The project uses TypeScript for type safety. Key interfaces are defined in component files.

### Code Organization
- Components are organized by feature
- Shared components are in `/shared`
- Contexts provide global state
- Services handle API and socket communication
- Utilities contain helper functions

## 📝 TODO / Backend Integration

When connecting to a real backend:

1. Update API URLs in `.env`
2. Uncomment Socket.IO connection in `services/socket.ts`
3. Remove simulated data from components
4. Implement error handling for API calls
5. Add loading states
6. Implement authentication token storage
7. Add form validation

## 🎯 Features to Implement

- [ ] File upload for posts and messages
- [ ] Advanced search and filtering
- [ ] Notifications panel
- [ ] Video/audio calls
- [ ] Event calendar view
- [ ] Analytics dashboard
- [ ] Mobile responsive improvements
- [ ] Dark mode support

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Write meaningful commit messages
5. Test components before committing

## 📄 License

This project is part of the CampusConnect platform.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS