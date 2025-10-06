// Socket.IO client setup
// import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: any = null;

  connect() {
    // Uncomment when backend is ready
    // this.socket = io(SOCKET_URL, {
    //   transports: ['websocket'],
    //   autoConnect: true,
    // });

    // this.socket.on('connect', () => {
    //   console.log('Socket connected:', this.socket.id);
    // });

    // this.socket.on('disconnect', () => {
    //   console.log('Socket disconnected');
    // });

    // this.socket.on('error', (error: any) => {
    //   console.error('Socket error:', error);
    // });

    console.log('Socket service initialized (simulated)');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.log('Socket emit (simulated):', event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.log('Socket on (simulated):', event);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Real-time event handlers
  onNotification(callback: (notification: any) => void) {
    this.on('notification', callback);
  }

  onMessage(callback: (message: any) => void) {
    this.on('message', callback);
  }

  onConnectionRequest(callback: (request: any) => void) {
    this.on('connection_request', callback);
  }

  onEventUpdate(callback: (event: any) => void) {
    this.on('event_update', callback);
  }

  // Emit events
  sendMessage(data: { to: string; content: string }) {
    this.emit('send_message', data);
  }

  joinRoom(roomId: string) {
    this.emit('join_room', roomId);
  }

  leaveRoom(roomId: string) {
    this.emit('leave_room', roomId);
  }
}

const socketService = new SocketService();
export default socketService;