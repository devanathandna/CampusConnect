import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  avatar: string;
  major?: string;
  graduationYear?: string;
  company?: string;
  department?: string;
  skills: string[];
  interests: string[];
  bio: string;
  connections: number;
  endorsements: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: string) => {
    const newUser: User = {
      id: Date.now(),
      email,
      role,
      name: email.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      major: role === 'student' ? 'Computer Science' : undefined,
      graduationYear: role === 'student' ? '2025' : '2020',
      company: role === 'alumni' ? 'Tech Corp' : undefined,
      department: role === 'faculty' ? 'Computer Science' : undefined,
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      interests: ['Web Development', 'AI/ML', 'Career Development'],
      bio: 'Passionate about technology and learning.',
      connections: 0,
      endorsements: 0
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;