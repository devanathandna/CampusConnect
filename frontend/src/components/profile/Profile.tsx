import React, { useState } from 'react';
import { Settings, GraduationCap, Briefcase, Award, Plus } from 'lucide-react';

interface ProfileProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  posts: any[];
  addNotification: (notification: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, setCurrentUser, posts, addNotification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(currentUser?.bio || '');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <img
              src={currentUser?.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{currentUser?.name}</h1>
            <p className="text-lg text-gray-600 capitalize mt-1">{currentUser?.role}</p>
            {currentUser?.major && (
              <p className="text-gray-600 flex items-center mt-1">
                <GraduationCap className="w-4 h-4 mr-2" />
                {currentUser.major} • Class of {currentUser.graduationYear}
              </p>
            )}
            {currentUser?.company && (
              <p className="text-gray-600 flex items-center mt-1">
                <Briefcase className="w-4 h-4 mr-2" />
                {currentUser.company}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentUser?.connections}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentUser?.endorsements}</div>
              <div className="text-sm text-gray-600">Endorsements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Tell us about yourself..."
                aria-label="Edit bio"
              />
            ) : (
              <p className="text-gray-700">{currentUser?.bio}</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {currentUser?.skills?.map((skill: string) => (
                <span key={skill} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {skill}
                  <Award className="w-4 h-4 inline ml-2" />
                </span>
              ))}
              {isEditing && (
                <button className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-full text-gray-600 hover:border-blue-500 hover:text-blue-600">
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Skill
                </button>
              )}
            </div>
          </div>

          {/* Interests Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {currentUser?.interests?.map((interest: string) => (
                <span key={interest} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCurrentUser({ ...currentUser, bio: editedBio });
                  setIsEditing(false);
                  addNotification({
                    id: Date.now(),
                    type: 'profile_updated',
                    message: 'Profile updated successfully',
                    timestamp: new Date(),
                    read: false
                  });
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;