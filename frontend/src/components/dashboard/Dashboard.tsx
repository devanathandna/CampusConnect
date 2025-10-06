import React, { useState, useEffect } from 'react';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Feed from './Feed';
import Network from './Network';
import Events from '../events/EventsList';
import Mentorship from './Mentorship';
import Messages from '../messaging/Messages';
import Profile from '../profile/Profile';

interface DashboardProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface Connection {
  id: number;
  from: number;
  to: number;
  status: string;
  timestamp: Date;
}

interface Event {
  id: number;
  createdBy: number;
  attendees: number[];
  timestamp: Date;
  [key: string]: any;
}

interface Message {
  id: number;
  from: number;
  to: number;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Post {
  id: number;
  author: any;
  content: string;
  type: string;
  likes: number;
  comments: any[];
  timestamp: Date;
}

interface MentorshipRequest {
  id: number;
  mentee: number;
  mentor: number;
  topic: string;
  status: string;
  timestamp: Date;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, setCurrentUser }) => {
  const [activeView, setActiveView] = useState('feed');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connections, setConnections] = useState<Connection[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        const notificationTypes = ['connection_request', 'event_reminder', 'message', 'endorsement'];
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        addNotification({
          id: Date.now(),
          type: randomType,
          message: getNotificationMessage(randomType),
          timestamp: new Date(),
          read: false
        });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const getNotificationMessage = (type: string) => {
    const messages: Record<string, string> = {
      connection_request: 'New connection request from an alumnus',
      event_reminder: 'Upcoming event: Tech Career Fair in 2 hours',
      message: 'You have a new message',
      endorsement: 'Someone endorsed your React.js skill'
    };
    return messages[type];
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
  };

  const sendConnectionRequest = (userId: number) => {
    setConnections(prev => [...prev, {
      id: Date.now(),
      from: currentUser.id,
      to: userId,
      status: 'pending',
      timestamp: new Date()
    }]);
    
    addNotification({
      id: Date.now(),
      type: 'connection_sent',
      message: 'Connection request sent successfully',
      timestamp: new Date(),
      read: false
    });
  };

  const createPost = (content: string, type = 'update') => {
    const newPost = {
      id: Date.now(),
      author: currentUser,
      content,
      type,
      likes: 0,
      comments: [],
      timestamp: new Date()
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const createEvent = (eventData: any) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      createdBy: currentUser.id,
      attendees: [],
      timestamp: new Date()
    };
    
    setEvents(prev => [...prev, newEvent]);
    addNotification({
      id: Date.now(),
      type: 'event_created',
      message: 'Event created successfully',
      timestamp: new Date(),
      read: false
    });
  };

  const rsvpEvent = (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, attendees: [...event.attendees, currentUser.id] }
        : event
    ));
    
    addNotification({
      id: Date.now(),
      type: 'event_rsvp',
      message: 'Successfully registered for event',
      timestamp: new Date(),
      read: false
    });
  };

  const requestMentorship = (mentorId: number, topic: string) => {
    const request = {
      id: Date.now(),
      mentee: currentUser.id,
      mentor: mentorId,
      topic,
      status: 'pending',
      timestamp: new Date()
    };
    
    setMentorshipRequests(prev => [...prev, request]);
    addNotification({
      id: Date.now(),
      type: 'mentorship_request',
      message: 'Mentorship request sent',
      timestamp: new Date(),
      read: false
    });
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !chatUser) return;
    
    const newMessage = {
      id: Date.now(),
      from: currentUser.id,
      to: chatUser.id,
      content: messageInput,
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    setTimeout(() => {
      addNotification({
        id: Date.now(),
        type: 'message_delivered',
        message: 'Message delivered',
        timestamp: new Date(),
        read: false
      });
    }, 500);
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-6">
          {activeView === 'feed' && <Feed currentUser={currentUser} posts={posts} createPost={createPost} />}
          {activeView === 'network' && <Network currentUser={currentUser} sendConnectionRequest={sendConnectionRequest} setChatUser={setChatUser} setActiveView={setActiveView} />}
          {activeView === 'events' && <Events events={events} rsvpEvent={rsvpEvent} createEvent={createEvent} />}
          {activeView === 'mentorship' && <Mentorship requestMentorship={requestMentorship} />}
          {activeView === 'messages' && <Messages currentUser={currentUser} messages={messages} chatUser={chatUser} setChatUser={setChatUser} messageInput={messageInput} setMessageInput={setMessageInput} sendMessage={sendMessage} />}
          {activeView === 'profile' && <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} posts={posts} addNotification={addNotification} />}
        </main>
      </div>
    </>
  );
};

export default Dashboard;