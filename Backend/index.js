import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../models/index.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Auth backend running ✅'));

app.use('/api/auth', authRoutes);

db.sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
