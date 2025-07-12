'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tags = [
      { id: Sequelize.literal('(UUID())'), name: 'React', createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('(UUID())'), name: 'JWT', createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('(UUID())'), name: 'Node.js', createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('(UUID())'), name: 'Express', createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('(UUID())'), name: 'Sequelize', createdAt: new Date(), updatedAt: new Date() },
      { id: Sequelize.literal('(UUID())'), name: 'MySQL', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('Tags', tags, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', {
      name: ['React', 'JWT', 'Node.js', 'Express', 'Sequelize', 'MySQL']
    }, {});
  }
};
