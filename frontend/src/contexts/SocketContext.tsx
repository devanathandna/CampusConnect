import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SocketContextType {
  socket: any;
  connected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  // Simulated socket connection
  useEffect(() => {
    // In a real application, you would connect to Socket.IO here
    // const newSocket = io('http://localhost:5000');
    // setSocket(newSocket);
    // newSocket.on('connect', () => setConnected(true));
    // newSocket.on('disconnect', () => setConnected(false));
    
    // Simulating connection
    setConnected(true);

    return () => {
      // newSocket.disconnect();
    };
  }, []);

  const emit = (event: string, data: any) => {
    // Simulate emit
    console.log('Socket emit:', event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    // Simulate on
    console.log('Socket on:', event);
  };

  return (
    <SocketContext.Provider value={{ socket, connected, emit, on }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;