import React, { useState } from 'react';
import { TrendingUp, Award, Star, MessageSquare } from 'lucide-react';

interface FeedProps {
  currentUser: any;
  posts: any[];
  createPost: (content: string, type?: string) => void;
}

const Feed: React.FC<FeedProps> = ({ currentUser, posts, createPost }) => {
  const [postContent, setPostContent] = useState('');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-4">
          <img src={currentUser?.avatar} alt="You" className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share an update, opportunity, or achievement..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Award className="w-4 h-4 inline mr-1" />
                  Add Media
                </button>
              </div>
              <button
                onClick={() => {
                  if (postContent.trim()) {
                    createPost(postContent);
                    setPostContent('');
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share something with your network!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                    <p className="text-sm text-gray-600">{post.author.role} • {new Date(post.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="mt-3 text-gray-800">{post.content}</p>
                <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <Star className="w-5 h-5" />
                    <span className="text-sm">{post.likes} Likes</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">{post.comments.length} Comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;