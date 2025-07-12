import express from 'express';
import { postAnswer, voteAnswer, acceptAnswer } from '../controllers/answerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:questionId', authMiddleware, postAnswer);
router.post('/vote/:id', authMiddleware, voteAnswer);
router.post('/accept/:id', authMiddleware, acceptAnswer);

export default router;
