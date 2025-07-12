import express from 'express';
import {
  postQuestion,
  deleteQuestion,
  updateQuestion,
  markQuestionAsResolved,
  voteQuestion,
  getQuestionById,
  getQuestions
} from '../controllers/questionController.js';
import authMiddleware  from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, postQuestion);
router.patch('/:id', authMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);
router.patch('/:id/resolve', authMiddleware, markQuestionAsResolved);
router.post('/:id/vote',authMiddleware, voteQuestion); 
router.get('/get/:id', authMiddleware, getQuestionById);
router.get('/all', getQuestions);


export default router;
