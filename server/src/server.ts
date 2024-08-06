import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import adminRoutes from '../routes/adminRoutes';
import dotenv from 'dotenv';
import { setupSocketIO } from './socket'; 

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

setupSocketIO(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
