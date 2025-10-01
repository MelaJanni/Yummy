module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'favorites',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['recipeId'] },
      { unique: true, fields: ['userId', 'recipeId'] }
    ]
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Favorite.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
  };

  return Favorite;
};
