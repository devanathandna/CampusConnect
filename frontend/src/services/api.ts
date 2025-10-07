import { 
  User, 
  Post, 
  Event, 
  Mentorship, 
  Connection, 
  Message, 
  Notification, 
  Group,
  SkillGap,
  Analytics,
  KnowledgePost
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://campusconnect-jnoa.onrender.com/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important: Send cookies with requests for session auth
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          this.logout();
          window.location.href = '/';
        }
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // ==================== AUTH ====================
  async login(email: string, password: string, role: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    // For session-based auth, token is just a placeholder
    if (data.token && data.token !== 'session-based-auth') {
      this.setToken(data.token);
    }
    return data;
  }

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    // For session-based auth, token is just a placeholder
    if (data.token && data.token !== 'session-based-auth') {
      this.setToken(data.token);
    }
    return data;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('auth_token');
    try {
      await this.request<void>('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // ==================== USERS ====================
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async getUserById(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async searchUsers(query: string, filters?: {
    role?: string;
    major?: string;
    skills?: string[];
    graduationYear?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams({ q: query, ...filters as any });
    return this.request<User[]>(`/users/search?${params}`);
  }

  async getUsers(limit = 20, offset = 0): Promise<{ users: User[]; total: number }> {
    return this.request<{ users: User[]; total: number }>(`/users?limit=${limit}&offset=${offset}`);
  }

  // ==================== CONNECTIONS ====================
  async getConnections(userId: string): Promise<Connection[]> {
    return this.request<Connection[]>(`/users/${userId}/connections`);
  }

  async sendConnectionRequest(targetUserId: string, message?: string): Promise<Connection> {
    return this.request<Connection>('/connections/request', {
      method: 'POST',
      body: JSON.stringify({ targetUserId, message }),
    });
  }

  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    return this.request<Connection>(`/connections/${connectionId}/accept`, {
      method: 'PUT',
    });
  }

  async rejectConnectionRequest(connectionId: string): Promise<void> {
    await this.request<void>(`/connections/${connectionId}`, {
      method: 'DELETE',
    });
  }

  async endorseSkill(userId: string, skill: string): Promise<User> {
    return this.request<User>(`/users/${userId}/endorse`, {
      method: 'POST',
      body: JSON.stringify({ skill }),
    });
  }

  // ==================== POSTS ====================
  async getPosts(filters?: { type?: string; tags?: string[] }): Promise<Post[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Post[]>(`/posts?${params}`);
  }

  async createPost(postData: Partial<Post>): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string): Promise<Post> {
    return this.request<Post>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async commentOnPost(postId: string, content: string): Promise<Post> {
    return this.request<Post>(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // ==================== EVENTS ====================
  async getEvents(filters?: { category?: string; upcoming?: boolean }): Promise<Event[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Event[]>(`/events?${params}`);
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async rsvpEvent(eventId: string, status: 'going' | 'interested' | 'not_going'): Promise<Event> {
    return this.request<Event>(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async submitEventFeedback(eventId: string, rating: number, feedback: string): Promise<Event> {
    return this.request<Event>(`/events/${eventId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  }

  async getRecommendedEvents(userId: string): Promise<Event[]> {
    return this.request<Event[]>(`/events/recommended/${userId}`);
  }

  // ==================== MENTORSHIP ====================
  async getMentorships(userId: string): Promise<Mentorship[]> {
    return this.request<Mentorship[]>(`/users/${userId}/mentorships`);
  }

  async requestMentorship(mentorId: string, message: string, goals: string[]): Promise<Mentorship> {
    return this.request<Mentorship>('/mentorships/request', {
      method: 'POST',
      body: JSON.stringify({ mentorId, message, goals }),
    });
  }

  async getRecommendedMentors(userId: string): Promise<Array<{ mentor: User; matchScore: number; reason: string }>> {
    return this.request<Array<{ mentor: User; matchScore: number; reason: string }>>(`/mentorships/recommended/${userId}`);
  }

  // ==================== MESSAGES ====================
  async getConversations(userId: string): Promise<any[]> {
    return this.request<any[]>(`/messages/conversations/${userId}`);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.request<Message[]>(`/messages/${conversationId}`);
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, content }),
    });
  }

  // ==================== NOTIFICATIONS ====================
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.request<Notification[]>(`/notifications/${userId}`);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await this.request<void>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // ==================== GROUPS ====================
  async getGroups(filters?: { type?: string; privacy?: string }): Promise<Group[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Group[]>(`/groups?${params}`);
  }

  async getGroupById(groupId: string): Promise<Group> {
    return this.request<Group>(`/groups/${groupId}`);
  }

  async createGroup(groupData: Partial<Group>): Promise<Group> {
    return this.request<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async joinGroup(groupId: string): Promise<Group> {
    return this.request<Group>(`/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  // ==================== SKILL GAP ====================
  async analyzeSkillGap(userId: string, careerGoal: string): Promise<SkillGap> {
    return this.request<SkillGap>('/skillgap/analyze', {
      method: 'POST',
      body: JSON.stringify({ userId, careerGoal }),
    });
  }

  async getSkillGapAnalysis(userId: string): Promise<SkillGap | null> {
    return this.request<SkillGap | null>(`/skillgap/${userId}`);
  }

  // ==================== GAMIFICATION ====================
  async awardPoints(userId: string, points: number, reason: string): Promise<User> {
    return this.request<User>(`/gamification/${userId}/points`, {
      method: 'POST',
      body: JSON.stringify({ points, reason }),
    });
  }

  async getLeaderboard(type: 'points' | 'connections' | 'events' | 'mentorship', limit = 10): Promise<Array<{
    user: User;
    score: number;
    rank: number;
  }>> {
    return this.request<Array<{ user: User; score: number; rank: number }>>(`/gamification/leaderboard/${type}?limit=${limit}`);
  }

  // ==================== ANALYTICS ====================
  async getAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly'): Promise<Analytics> {
    return this.request<Analytics>(`/analytics?period=${period}`);
  }

  // ==================== KNOWLEDGE HUB ====================
  async searchKnowledgePosts(params: {
    q?: string;
    category?: string;
    company?: string;
    industry?: string;
    skill?: string;
    courseCode?: string;
    verified?: boolean;
    evergreen?: boolean;
    sortBy?: 'relevance' | 'recent' | 'popular' | 'helpful';
    page?: number;
    limit?: number;
  }): Promise<{ posts: KnowledgePost[]; total: number; page: number; pages: number }> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return this.request<{ posts: KnowledgePost[]; total: number; page: number; pages: number }>(
      `/knowledge/search?${queryString}`
    );
  }

  async getKnowledgePost(id: string): Promise<{ post: KnowledgePost }> {
    return this.request<{ post: KnowledgePost }>(`/knowledge/${id}`);
  }

  async createKnowledgePost(postData: {
    title: string;
    body: string;
    category: string;
    tags?: string[];
    company?: string;
    industry?: string;
    relatedSkills?: string[];
    courseCodes?: string[];
    isEvergreen?: boolean;
  }): Promise<{ message: string; post: KnowledgePost }> {
    return this.request<{ message: string; post: KnowledgePost }>('/knowledge', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async voteKnowledgePost(id: string, voteType: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number; voteScore: number }> {
    return this.request<{ upvotes: number; downvotes: number; voteScore: number }>(`/knowledge/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  }

  async markKnowledgePostHelpful(id: string): Promise<{ helpfulCount: number }> {
    return this.request<{ helpfulCount: number }>(`/knowledge/${id}/helpful`, {
      method: 'POST',
    });
  }

  async bookmarkKnowledgePost(id: string): Promise<{ bookmarked: boolean; bookmarkCount: number }> {
    return this.request<{ bookmarked: boolean; bookmarkCount: number }>(`/knowledge/${id}/bookmark`, {
      method: 'POST',
    });
  }

  async commentOnKnowledgePost(id: string, content: string): Promise<{ comments: any[] }> {
    return this.request<{ comments: any[] }>(`/knowledge/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async verifyKnowledgePost(id: string): Promise<{ message: string; post: KnowledgePost }> {
    return this.request<{ message: string; post: KnowledgePost }>(`/knowledge/${id}/verify`, {
      method: 'POST',
    });
  }

  async getBookmarkedKnowledgePosts(): Promise<{ posts: KnowledgePost[] }> {
    return this.request<{ posts: KnowledgePost[] }>('/knowledge/user/bookmarks');
  }

  async getTrendingKnowledgePosts(): Promise<{ posts: KnowledgePost[] }> {
    return this.request<{ posts: KnowledgePost[] }>('/knowledge/trending');
  }
}

export const api = new ApiService();
export default api;
