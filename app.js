import express from 'express';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contactsRouter.js';
import connectDB from './db/db.js';

const app = express();

connectDB();

app.use(express.json());

app.use('/users', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});