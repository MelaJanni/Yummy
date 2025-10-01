module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cuisine: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
      defaultValue: 'medium'
    },
    minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
      defaultValue: 'draft',
      allowNull: false
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'recipes',
    timestamps: true,
    paranoid: true,
    indexes: [
      { unique: true, fields: ['slug'] },
      { fields: ['status'] },
      { fields: ['authorId'] },
      { fields: ['cuisine'] },
      { fields: ['difficulty'] },
      { fields: ['minutes'] },
      { fields: ['createdAt'] }
    ]
  });

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });
    Recipe.hasMany(models.RecipeIngredient, {
      foreignKey: 'recipeId',
      as: 'recipeIngredients'
    });
    Recipe.hasMany(models.Step, {
      foreignKey: 'recipeId',
      as: 'steps'
    });
    Recipe.belongsToMany(models.Tag, {
      through: models.RecipeTag,
      foreignKey: 'recipeId',
      otherKey: 'tagId',
      as: 'tags'
    });
    Recipe.belongsToMany(models.Allergen, {
      through: models.RecipeAllergen,
      foreignKey: 'recipeId',
      otherKey: 'allergenId',
      as: 'allergens'
    });
    Recipe.belongsToMany(models.Diet, {
      through: models.RecipeDiet,
      foreignKey: 'recipeId',
      otherKey: 'dietId',
      as: 'diets'
    });
    Recipe.hasMany(models.Rating, {
      foreignKey: 'recipeId',
      as: 'ratings'
    });
    Recipe.hasMany(models.Comment, {
      foreignKey: 'recipeId',
      as: 'comments'
    });
    Recipe.hasMany(models.Favorite, {
      foreignKey: 'recipeId',
      as: 'favorites'
    });
  };

  return Recipe;
};
