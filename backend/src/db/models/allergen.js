module.exports = (sequelize, DataTypes) => {
  const Allergen = sequelize.define('Allergen', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'allergens',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['name'] }
    ]
  });

  Allergen.associate = (models) => {
    Allergen.belongsToMany(models.Recipe, {
      through: models.RecipeAllergen,
      foreignKey: 'allergenId',
      otherKey: 'recipeId',
      as: 'recipes'
    });
  };

  return Allergen;
};
