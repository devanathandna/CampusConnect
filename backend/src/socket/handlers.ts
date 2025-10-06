import { Server } from 'socket.io';
import { io } from '../server';
import Notification from '../models/Notification';

interface UserSocket {
  userId: string;
  socketId: string;
}

const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins with their ID
  socket.on('join', (userId: string) => {
    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} joined`);

    // Broadcast online status
    socket.broadcast.emit('user_online', { userId });
  });

  // Typing indicator
  socket.on('typing', (data: { to: string; from: string; isTyping: boolean }) => {
    io.to(data.to).emit('user_typing', {
      from: data.from,
      isTyping: data.isTyping
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    let disconnectedUserId: string | null = null;
    
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        connectedUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      socket.broadcast.emit('user_offline', { userId: disconnectedUserId });
      console.log(`User ${disconnectedUserId} disconnected`);
    }
  });
});