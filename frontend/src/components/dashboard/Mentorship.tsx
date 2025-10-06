import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';

interface MentorshipProps {
  requestMentorship: (mentorId: number, topic: string) => void;
}

const Mentorship: React.FC<MentorshipProps> = ({ requestMentorship }) => {
  const [mentorSearch, setMentorSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const mentors = [
    { id: 1, name: 'Dr. Emily Brown', role: 'faculty', expertise: ['AI', 'Machine Learning', 'Research'], availability: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
    { id: 2, name: 'Robert Chen', role: 'alumni', expertise: ['Software Engineering', 'System Design', 'Career Advice'], company: 'Amazon', availability: 'Limited', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert' },
    { id: 3, name: 'Lisa Anderson', role: 'alumni', expertise: ['Data Science', 'Analytics', 'Product Management'], company: 'Meta', availability: 'Available', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Mentor</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            value={mentorSearch}
            onChange={(e) => setMentorSearch(e.target.value)}
            placeholder="Search by name or expertise..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search mentors"
          />
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by topic"
          >
            <option value="">All Topics</option>
            <option value="career">Career Development</option>
            <option value="technical">Technical Skills</option>
            <option value="research">Research</option>
          </select>
        </div>

        <div className="space-y-4">
          {mentors.map(mentor => (
            <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img src={mentor.avatar} alt={mentor.name} className="w-20 h-20 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{mentor.role}</p>
                      {mentor.company && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {mentor.company}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mentor.availability === 'Available' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {mentor.availability}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => requestMentorship(mentor.id, 'General Career Guidance')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Request Mentorship
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow p-6 text-white">
        <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
        <p className="mb-4 opacity-90">Get personalized mentor recommendations based on your goals and interests</p>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">
          Get Recommendations
        </button>
      </div>
    </div>
  );
};

export default Mentorship;