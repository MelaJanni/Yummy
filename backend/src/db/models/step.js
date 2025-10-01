module.exports = (sequelize, DataTypes) => {
  const Step = sequelize.define('Step', {
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'steps',
    timestamps: false,
    indexes: [
      { fields: ['recipeId', 'order'] }
    ]
  });

  Step.associate = (models) => {
    Step.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe'
    });
  };

  return Step;
};
