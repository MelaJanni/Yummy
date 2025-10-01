const env = require('./env');

module.exports = {
  development: {
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: console.log,
  },
  production: {
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
