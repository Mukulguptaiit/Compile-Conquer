import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const users = [
    { id: uuidv4(), name: "Alex", email: "alex@example.com", password: "hashed", role: "user" },
    { id: uuidv4(), name: "Sarah", email: "sarah@example.com", password: "hashed", role: "user" },
  ];

  const tags = ["React", "SQL", "Node.js", "Python", "Authentication"].map((tag) => ({
    id: uuidv4(),
    name: tag,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert("Users", users);
  await queryInterface.bulkInsert("Tags", tags);

  const questions = [];
  const questionTags = [];
  const answers = [];

  for (let i = 1; i <= 20; i++) {
    const user = users[i % 2];
    const questionId = uuidv4();
    questions.push({
      id: questionId,
      title: `Sample Question #${i}`,
      description: `How do I implement feature #${i} in my project?`,
      userId: user.id,
      upvotes: Math.floor(Math.random() * 10),
      downvotes: Math.floor(Math.random() * 3),
      hasAcceptedAnswer: i % 3 === 0,
      resolved: i % 5 === 0,
      answers: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Randomly associate 2 tags per question
    const tagIds = tags.sort(() => 0.5 - Math.random()).slice(0, 2).map(t => t.id);
    tagIds.forEach((tagId) => {
      questionTags.push({
        questionId,
        tagId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Seed 2 answers per question
    for (let j = 0; j < 2; j++) {
      answers.push({
        id: uuidv4(),
        content: `This is answer #${j + 1} for question #${i}`,
        userId: users[(i + j) % 2].id,
        questionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  await queryInterface.bulkInsert("Questions", questions);
  await queryInterface.bulkInsert("QuestionTags", questionTags);
  await queryInterface.bulkInsert("Answers", answers);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Answers", null, {});
  await queryInterface.bulkDelete("QuestionTags", null, {});
  await queryInterface.bulkDelete("Questions", null, {});
  await queryInterface.bulkDelete("Tags", null, {});
  await queryInterface.bulkDelete("Users", null, {});
}
