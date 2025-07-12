import db from '../models/index.js';

const { Question, Tag } = db;

export const postQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description || !Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ message: 'Title, description, and at least one tag are required.' });
  }

  try {
    // Find or create tags
    const tagRecords = await Promise.all(
      tags.map(async (tagName) => {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.trim() }
        });
        return tag;
      })
    );

    // Create question
    const question = await Question.create({
      title,
      description,
      userId: req.user.userId,
      tags: tags.join(',')  // Optional: kept for backward compatibility
    });

    // Associate tags
    await question.setTags(tagRecords);

    res.status(201).json({
      message: 'Question posted successfully',
      question,
      tags: tagRecords.map(tag => tag.name)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to post question', error: err.message });
  }
};


export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this question' });
    }

    await question.destroy();

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question', error: err.message });
  }
};
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  try {
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to edit this question' });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    question.tags = tags ? tags.join(',') : question.tags;

    await question.save();

    res.status(200).json({ message: 'Question updated successfully', question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update question', error: err.message });
  }
};
export const markQuestionAsResolved = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to mark as resolved' });
    }

    question.resolved = true;
    await question.save();

    res.status(200).json({ message: 'Question marked as resolved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as resolved', error: err.message });
  }
};


export const voteQuestion = async (req, res) => {
  const { id } = req.params; // questionId
  const { value } = req.body; // 1 for upvote, -1 for downvote
  const userId = req.user.userId;

  if (![1, -1].includes(value)) {
    return res.status(400).json({ message: 'Vote must be 1 or -1' });
  }

  try {
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const existingVote = await VoteQuestion.findOne({
      where: { questionId: id, userId }
    });

    if (!existingVote) {
      await VoteQuestion.create({ questionId: id, userId, value });
      value === 1 ? question.upvotes++ : question.downvotes++;
    } else {
      if (existingVote.value === value) {
        // Remove vote
        await existingVote.destroy();
        value === 1 ? question.upvotes-- : question.downvotes--;
      } else {
        // Flip vote
        existingVote.value = value;
        await existingVote.save();
        if (value === 1) {
          question.upvotes++;
          question.downvotes--;
        } else {
          question.upvotes--;
          question.downvotes++;
        }
      }
    }

    await question.save();
    res.status(200).json({ message: 'Vote recorded', upvotes: question.upvotes, downvotes: question.downvotes });

  } catch (err) {
    res.status(500).json({ message: 'Voting failed', error: err.message });
  }
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await db.models.Question.findByPk(id, {
      include: [
        {
          model: db.models.User,
          attributes: ['id', 'username']
        },
        {
          model: db.models.Tag,
          through: { attributes: [] },
          attributes: ['name']
        },
        {
          model: db.models.Answer,
          as: 'answers',
          include: [
            {
              model: db.models.User,
              attributes: ['id', 'username']
            },
            {
              model: db.models.VoteAnswer,
              attributes: ['userId', 'value']
            }
          ]
        }
      ],
      order: [[{ model: db.models.Answer, as: 'answers' }, 'createdAt', 'ASC']]
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const formattedAnswers = question.answers.map(answer => ({
      id: answer.id,
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      user: answer.User,
      voteCount: answer.VoteAnswers?.reduce((acc, v) => acc + v.value, 0) || 0
    }));

    res.status(200).json({
      question: {
        id: question.id,
        title: question.title,
        description: question.description,
        user: question.User,
        tags: question.Tags.map(tag => tag.name),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        resolved: question.resolved,
        upvotes: question.upvotes,
        downvotes: question.downvotes
      },
      answers: formattedAnswers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch question', error: err.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { search, sort, filter, tags, page = 1, limit = 10 } = req.query;

    const where = {};

    // 🔍 Search (title + description)
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // ✅ Filters
    if (filter === 'answered') {
      where.answers = { [Op.gt]: 0 };
    } else if (filter === 'unanswered') {
      where.answers = 0;
    } else if (filter === 'accepted') {
      where.hasAcceptedAnswer = true;
    }

    // 🧮 Sorting
    let order = [['createdAt', 'DESC']];
    if (sort === 'oldest') order = [['createdAt', 'ASC']];
    else if (sort === 'most-votes') order = [['upvotes', 'DESC']];
    else if (sort === 'most-answers') order = [['answers', 'DESC']];

    // 🏷️ Include and filter tags
    const include = [
      {
        model: db.User,
        attributes: ['id', 'name'],
      },
      {
        model: db.Tag,
        attributes: ['name'],
        through: { attributes: [] },
      },
    ];

    if (tags) {
      const tagList = tags.split(',');
      include.push({
        model: db.Tag,
        where: { name: { [Op.in]: tagList } },
        through: { attributes: [] },
        required: true,
        attributes: [],
      });
    }

    // 🧾 Pagination
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const offset = (pageNum - 1) * pageSize;

    const { count, rows: questions } = await db.Question.findAndCountAll({
      where,
      include,
      order,
      limit: pageSize,
      offset,
      distinct: true // important for correct count with many-to-many joins
    });

    res.status(200).json({
      questions,
      meta: {
        total: count,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};