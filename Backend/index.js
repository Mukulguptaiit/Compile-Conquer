import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../Backend/models/index.js';
import authRoutes from './routes/authRoutes.js';
import answerRoutes from './routes/answerRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Auth backend running ✅'));

app.use('/api/auth', authRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/notifications', notificationRoutes);

db.sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
