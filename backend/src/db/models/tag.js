module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
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
    tableName: 'tags',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['name'] }
    ]
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Recipe, {
      through: models.RecipeTag,
      foreignKey: 'tagId',
      otherKey: 'recipeId',
      as: 'recipes'
    });
  };

  return Tag;
};
