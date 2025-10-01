module.exports = (sequelize, DataTypes) => {
  const Diet = sequelize.define('Diet', {
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
    tableName: 'diets',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['name'] }
    ]
  });

  Diet.associate = (models) => {
    Diet.belongsToMany(models.Recipe, {
      through: models.RecipeDiet,
      foreignKey: 'dietId',
      otherKey: 'recipeId',
      as: 'recipes'
    });
  };

  return Diet;
};
