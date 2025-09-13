import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const connectionUrl = process.env.MONGO_DB_URI;

mongoose.connect(connectionUrl).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});