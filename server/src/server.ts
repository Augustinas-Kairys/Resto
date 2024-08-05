import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import adminRoutes from '../routes/adminRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const mongoURI = process.env.MONGO_URI || '';
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create-post', (data) => {
    console.log('Received create-post event:', data);
    socket.broadcast.emit('receive-post', data);
  });

  socket.on('add-comment', (data) => {
    console.log('Received add-comment event:', data);
    socket.broadcast.emit('receive-comment', data);
  });

  socket.on('like-post', ({ postId, isLiked }) => {
    console.log('Received like-post event:', { postId, isLiked });
    socket.broadcast.emit('post-liked', { postId, isLiked });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
