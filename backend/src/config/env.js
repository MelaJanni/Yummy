require('dotenv').config();

module.exports = {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'yummy_recipes',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-me',
    expiration: process.env.JWT_EXPIRATION || '15m',
    refreshSecret: process.env.REFRESH_SECRET || 'change-me-refresh',
    refreshExpiration: process.env.REFRESH_EXPIRATION || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || require('path').join(__dirname, '../../uploads'),
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },
};
