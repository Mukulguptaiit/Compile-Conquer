import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class QuestionTag extends Model {
    static associate(models) {
      QuestionTag.belongsTo(models.Question, {
        foreignKey: 'questionId',
        onDelete: 'CASCADE',
      });

      QuestionTag.belongsTo(models.Tag, {
        foreignKey: 'tagId',
        onDelete: 'CASCADE',
      });
    }
  }

  QuestionTag.init(
    {
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id',
        },
      },
      tagId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'QuestionTag',
    }
  );

  return QuestionTag;
};
