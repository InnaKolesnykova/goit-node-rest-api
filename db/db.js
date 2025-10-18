import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  console.error(`Файл .env.example не знайдено за шляхом: ${envPath}`);
  process.exit(1);
}

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Помилка при читанні .env.example:', result.error);
  process.exit(1);
}

if (!process.env.MONGO_DB_URI) {
  console.error('Помилка: змінна MONGO_DB_URI не визначена!');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
