module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['email'] }
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      foreignKey: 'authorId',
      as: 'recipes'
    });
    User.hasMany(models.Rating, {
      foreignKey: 'userId',
      as: 'ratings'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments'
    });
    User.hasMany(models.Favorite, {
      foreignKey: 'userId',
      as: 'favorites'
    });
  };

  return User;
};
