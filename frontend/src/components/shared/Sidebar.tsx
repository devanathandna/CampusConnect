import React from 'react';
import { TrendingUp, Users, Calendar, Target, MessageSquare, User, Zap } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, sidebarOpen }) => {
  return (
    <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-16 left-0 w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto z-30`}>
      <nav className="p-4 space-y-2">
        <button
          onClick={() => setActiveView('feed')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'feed' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Feed</span>
        </button>

        <button
          onClick={() => setActiveView('network')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'network' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">My Network</span>
        </button>

        <button
          onClick={() => setActiveView('events')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'events' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Events</span>
        </button>

        <button
          onClick={() => setActiveView('mentorship')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'mentorship' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="font-medium">Mentorship</span>
        </button>

        <button
          onClick={() => setActiveView('messages')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'messages' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Messages</span>
        </button>

        <button
          onClick={() => setActiveView('profile')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
          <Zap className="w-6 h-6 mb-2" />
          <h4 className="font-semibold mb-1">Upgrade to Premium</h4>
          <p className="text-xs opacity-90">Get advanced analytics and insights</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;