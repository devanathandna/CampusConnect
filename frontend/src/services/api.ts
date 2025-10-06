// API Service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),
};

// User API
export const userAPI = {
  getProfile: (userId: string) =>
    apiRequest(`/users/${userId}`),
  
  updateProfile: (userId: string, data: any) =>
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  searchUsers: (query: string) =>
    apiRequest(`/users/search?q=${query}`),
};

// Connection API
export const connectionAPI = {
  sendRequest: (userId: string) =>
    apiRequest('/connections/request', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
  
  acceptRequest: (connectionId: string) =>
    apiRequest(`/connections/${connectionId}/accept`, {
      method: 'PUT',
    }),
  
  getConnections: () =>
    apiRequest('/connections'),
};

// Event API
export const eventAPI = {
  getEvents: () =>
    apiRequest('/events'),
  
  createEvent: (eventData: any) =>
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  
  rsvpEvent: (eventId: string) =>
    apiRequest(`/events/${eventId}/rsvp`, {
      method: 'POST',
    }),
};

// Message API
export const messageAPI = {
  getConversations: () =>
    apiRequest('/messages/conversations'),
  
  getMessages: (userId: string) =>
    apiRequest(`/messages/${userId}`),
  
  sendMessage: (userId: string, content: string) =>
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ userId, content }),
    }),
};

// Post API
export const postAPI = {
  getFeed: () =>
    apiRequest('/posts/feed'),
  
  createPost: (content: string) =>
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  likePost: (postId: string) =>
    apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
    }),
};

// Mentorship API
export const mentorshipAPI = {
  getMentors: () =>
    apiRequest('/mentorship/mentors'),
  
  requestMentorship: (mentorId: string, topic: string) =>
    apiRequest('/mentorship/request', {
      method: 'POST',
      body: JSON.stringify({ mentorId, topic }),
    }),
  
  getRequests: () =>
    apiRequest('/mentorship/requests'),
};

export default {
  auth: authAPI,
  user: userAPI,
  connection: connectionAPI,
  event: eventAPI,
  message: messageAPI,
  post: postAPI,
  mentorship: mentorshipAPI,
};