export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });

  Tag.associate = models => {
    Tag.belongsToMany(models.Question, {
      through: 'QuestionTag',
      foreignKey: 'tagId',
      otherKey: 'questionId'
    });
  };

  return Tag;
};
