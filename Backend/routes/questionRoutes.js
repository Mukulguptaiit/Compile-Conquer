import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  postQuestion,
  deleteQuestion,
  updateQuestion,
  markQuestionAsResolved
} from '../controllers/questionController.js';

const router = express.Router();

router.post('/', authMiddleware, postQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);
router.put('/:id', authMiddleware, updateQuestion);
router.patch('/:id/resolve', authMiddleware, markQuestionAsResolved);

export default router;
