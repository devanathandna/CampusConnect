import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface LoginProps {
  setCurrentUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLogin = (email: string, password: string, role: string) => {
    const user = {
      id: Date.now(),
      email,
      role,
      name: email.split('@')[0].replace('.', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      major: role === 'student' ? 'Computer Science' : null,
      graduationYear: role === 'student' ? '2025' : '2020',
      company: role === 'alumni' ? 'Tech Corp' : null,
      department: role === 'faculty' ? 'Computer Science' : null,
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      interests: ['Web Development', 'AI/ML', 'Career Development'],
      bio: 'Passionate about technology and learning.',
      connections: 0,
      endorsements: 0
    };
    
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CampusConnect</h1>
          <p className="text-gray-600 mt-2">Professional Campus Networking</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button
            onClick={() => handleLogin(email, password, role)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>

          <div className="text-center text-sm text-gray-600">
            Demo Mode - Enter any credentials to explore
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;