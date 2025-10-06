import React, { useState } from 'react';
import './App.css';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-gray-100">
          {!currentUser ? (
            <Login setCurrentUser={setCurrentUser} />
          ) : (
            <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} />
          )}
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
