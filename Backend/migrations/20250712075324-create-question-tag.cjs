'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QuestionTags', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())')
      },
      questionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QuestionTags');
  }
};
