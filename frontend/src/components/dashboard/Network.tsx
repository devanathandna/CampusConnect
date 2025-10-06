import React from 'react';
import { Filter, Briefcase, BookOpen } from 'lucide-react';

interface NetworkProps {
  currentUser: any;
  sendConnectionRequest: (userId: number) => void;
  setChatUser: (user: any) => void;
  setActiveView: (view: string) => void;
}

const Network: React.FC<NetworkProps> = ({ currentUser, sendConnectionRequest, setChatUser, setActiveView }) => {
  const sampleUsers = [
    { id: 1, name: 'John Doe', role: 'alumni', company: 'Google', skills: ['Python', 'ML', 'Cloud'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
    { id: 2, name: 'Jane Smith', role: 'faculty', department: 'CS', skills: ['Research', 'AI', 'Teaching'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
    { id: 3, name: 'Mike Johnson', role: 'student', major: 'Engineering', skills: ['Java', 'React', 'SQL'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
    { id: 4, name: 'Sarah Williams', role: 'alumni', company: 'Microsoft', skills: ['C#', '.NET', 'Azure'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Network</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleUsers.map(user => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  {user.company && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {user.company}
                    </p>
                  )}
                  {user.department && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {user.department}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => sendConnectionRequest(user.id)}
                      className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => {
                        setChatUser(user);
                        setActiveView('messages');
                      }}
                      className="px-4 py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;