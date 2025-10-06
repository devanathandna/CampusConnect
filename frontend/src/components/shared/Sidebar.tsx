import React from 'react';
import { TrendingUp, Users, Calendar, Target, MessageSquare, User, Zap, UsersRound, Trophy, Award } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, sidebarOpen }) => {
  const menuItems = [
    { id: 'feed', label: 'Feed', icon: TrendingUp },
    { id: 'network', label: 'My Network', icon: Users },
    { id: 'groups', label: 'Groups', icon: UsersRound },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'mentorship', label: 'Mentorship', icon: Target },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-16 left-0 w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto z-30 shadow-soft`}>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-sm scale-105 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50 hover:scale-102'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'messages' && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-4 text-white shadow-glow">
          <Zap className="w-6 h-6 mb-2" />
          <h4 className="font-semibold mb-1 font-display">Upgrade to Premium</h4>
          <p className="text-xs opacity-90 mb-3">Get advanced analytics and insights</p>
          <button className="w-full bg-white text-primary-600 text-sm font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-shadow">
            Learn More
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;