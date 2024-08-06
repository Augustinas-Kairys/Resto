import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupSocketIO = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:3000', 
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newOrder', () => {
      io.emit('refreshOrders');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};
