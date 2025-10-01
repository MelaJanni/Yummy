module.exports = (sequelize, DataTypes) => {
  const RecipeAllergen = sequelize.define('RecipeAllergen', {
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
    allergenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'allergens',
        key: 'id'
      }
    }
  }, {
    tableName: 'recipe_allergens',
    timestamps: false,
    indexes: [
      { fields: ['recipeId'] },
      { fields: ['allergenId'] }
    ]
  });

  return RecipeAllergen;
};
