module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'ingredients',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['name'] }
    ]
  });

  Ingredient.associate = (models) => {
    Ingredient.hasMany(models.RecipeIngredient, {
      foreignKey: 'ingredientId',
      as: 'recipeIngredients'
    });
  };

  return Ingredient;
};
