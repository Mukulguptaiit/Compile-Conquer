import db from '../models/index.js';
const { Answer, Question } = db;

export const postAnswer = async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: 'Answer content required' });

  try {
    const answer = await Answer.create({
      content,
      questionId,
      userId: req.user.userId
    });
    res.status(201).json({ message: 'Answer posted', answer });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post answer', error: err.message });
  }
};

export const voteAnswer = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'up' or 'down'

  try {
    const answer = await Answer.findByPk(id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (type === 'up') answer.upvotes += 1;
    else if (type === 'down') answer.downvotes += 1;
    else return res.status(400).json({ message: 'Invalid vote type' });

    await answer.save();
    res.json({ message: 'Vote recorded', upvotes: answer.upvotes, downvotes: answer.downvotes });
  } catch (err) {
    res.status(500).json({ message: 'Voting failed', error: err.message });
  }
};

export const acceptAnswer = async (req, res) => {
  const { id } = req.params;

  try {
    const answer = await Answer.findByPk(id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const question = await Question.findByPk(answer.questionId);
    if (question.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Only question owner can accept answer' });
    }

    await Answer.update({ isAccepted: false }, { where: { questionId: question.id } }); // Unaccept others
    answer.isAccepted = true;
    await answer.save();

    res.json({ message: 'Answer marked as accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept answer', error: err.message });
  }
};
export const voteQuestion = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // type = 'upvote' or 'downvote'

  if (!['upvote', 'downvote'].includes(type)) {
    return res.status(400).json({ message: 'Invalid vote type' });
  }

  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (type === 'upvote') question.upvotes += 1;
    else question.downvotes += 1;

    await question.save();

    res.status(200).json({
      message: `Question ${type}d successfully`,
      upvotes: question.upvotes,
      downvotes: question.downvotes
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to vote', error: err.message });
  }
};
