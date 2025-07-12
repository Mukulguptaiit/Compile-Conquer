import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../models/index.js'; // adjust path as needed

const seed = async () => {
  try {
    await db.sequelize.sync({ force: true }); // drops all tables and recreates them — only for local dev

    // 🔐 Create users
    const passwordHash = await bcrypt.hash('test1234', 10);
    const users = await db.User.bulkCreate([
      {
        id: uuidv4(),
        name: 'Alice Doe',
        email: 'alice@example.com',
        password: passwordHash,
        role: 'user',
      },
      {
        id: uuidv4(),
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: passwordHash,
        role: 'admin',
      },
    ], { individualHooks: true });

    // 🏷️ Create tags
    const tagNames = ['React', 'SQL', 'Node.js', 'Python', 'Authentication'];
    const tags = await db.Tag.bulkCreate(
      tagNames.map(name => ({
        id: uuidv4(),
        name,
      }))
    );

    // ❓ Create questions and answers
    const questions = [];
    const answers = [];

    for (let i = 1; i <= 20; i++) {
      const author = users[i % 2];
      const q = await db.Question.create({
        id: uuidv4(),
        title: `How to solve problem #${i}?`,
        description: `I need help solving problem #${i}.`,
        userId: author.id,
        resolved: i % 4 === 0,
        upvotes: Math.floor(Math.random() * 10),
        downvotes: Math.floor(Math.random() * 3),
      });

      // Connect tags
      const questionTags = tags.sort(() => 0.5 - Math.random()).slice(0, 2);
      await q.setTags(questionTags);

      // Create answers
      for (let j = 0; j < 3; j++) {
        answers.push({
          id: uuidv4(),
          content: `Answer #${j + 1} to question #${i}`,
          questionId: q.id,
          userId: users[(i + j) % 2].id,
        });
      }
    }

    await db.Answer.bulkCreate(answers);

    console.log("✅ Mock data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed mock data:", error);
    process.exit(1);
  }
};

seed();
