const { Sequelize } = require('sequelize');
const env = require('../../config/env');

const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: env.node_env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Recipe = require('./recipe')(sequelize, Sequelize);
db.Ingredient = require('./ingredient')(sequelize, Sequelize);
db.RecipeIngredient = require('./recipeIngredient')(sequelize, Sequelize);
db.Step = require('./step')(sequelize, Sequelize);
db.Tag = require('./tag')(sequelize, Sequelize);
db.RecipeTag = require('./recipeTag')(sequelize, Sequelize);
db.Allergen = require('./allergen')(sequelize, Sequelize);
db.RecipeAllergen = require('./recipeAllergen')(sequelize, Sequelize);
db.Diet = require('./diet')(sequelize, Sequelize);
db.RecipeDiet = require('./recipeDiet')(sequelize, Sequelize);
db.Rating = require('./rating')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Favorite = require('./favorite')(sequelize, Sequelize);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
