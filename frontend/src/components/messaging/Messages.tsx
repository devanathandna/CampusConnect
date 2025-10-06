import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface MessagesProps {
  currentUser: any;
  messages: any[];
  chatUser: any;
  setChatUser: (user: any) => void;
  messageInput: string;
  setMessageInput: (input: string) => void;
  sendMessage: () => void;
}

const Messages: React.FC<MessagesProps> = ({ 
  currentUser, 
  messages, 
  chatUser, 
  setChatUser, 
  messageInput, 
  setMessageInput, 
  sendMessage 
}) => {
  const conversations = [
    { id: 1, user: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' }, lastMessage: 'Thanks for the connection!', timestamp: '2 hours ago', unread: 2 },
    { id: 2, user: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' }, lastMessage: 'Looking forward to our meeting', timestamp: '5 hours ago', unread: 0 },
  ];

  const currentMessages = messages.filter(m => 
    chatUser && (m.from === chatUser.id || m.to === chatUser.id)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200">
          {/* Conversations List */}
          <div className="md:col-span-1 overflow-y-auto h-[600px]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setChatUser(conv.user)}
                  className={`w-full p-4 hover:bg-gray-50 text-left transition-colors ${
                    chatUser?.name === conv.user.name ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                        {conv.unread > 0 && (
                          <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{conv.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col h-[600px]">
            {chatUser ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                  <img src={chatUser.avatar} alt={chatUser.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{chatUser.name}</h3>
                    <p className="text-sm text-green-600">● Online</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    currentMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === currentUser.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.from === currentUser.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.from === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Message input"
                    />
                    <button
                      onClick={sendMessage}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      aria-label="Send message"
                      title="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p>Choose a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;