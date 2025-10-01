module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ratings',
    timestamps: true,
    indexes: [
      { fields: ['recipeId'] },
      { fields: ['userId'] },
      { unique: true, fields: ['recipeId', 'userId'] }
    ]
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Rating;
};
