module.exports = (sequelize, DataTypes) => {
  const RecipeDiet = sequelize.define('RecipeDiet', {
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'recipes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    dietId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'diets',
        key: 'id'
      }
    }
  }, {
    tableName: 'recipe_diets',
    timestamps: false,
    indexes: [
      { fields: ['recipeId'] },
      { fields: ['dietId'] }
    ]
  });

  return RecipeDiet;
};
