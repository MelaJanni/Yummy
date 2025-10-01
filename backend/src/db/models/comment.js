module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    guestName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    guestEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['recipeId'] },
      { fields: ['userId'] },
      { fields: ['parentId'] },
      { fields: ['createdAt'] }
    ]
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Comment.belongsTo(models.Comment, {
      foreignKey: 'parentId',
      as: 'parent'
    });
    Comment.hasMany(models.Comment, {
      foreignKey: 'parentId',
      as: 'replies'
    });
  };

  return Comment;
};
