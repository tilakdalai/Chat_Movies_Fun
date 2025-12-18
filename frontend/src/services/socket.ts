import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Use environment variable for backend URL, fallback to localhost for dev
    const socketUrl = import.meta.env.VITE_API_URL || 
      (window.location.hostname === 'localhost' 
        ? 'https://chat-movies-fun-backend.vercel.app/'
        : `${window.location.protocol}//${window.location.hostname}:3001`);

    console.log('Connecting to socket server:', socketUrl);
    console.log('Current location:', window.location.href);

    this.socket = io(socketUrl, {
      transports: ['polling', 'websocket'], // Try polling first for mobile compatibility
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10, // Increased for mobile networks
      timeout: 10000, // 10 second timeout
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server successfully');
      console.log('Socket ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      console.error('Socket URL was:', socketUrl);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect after all attempts');
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
