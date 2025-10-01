const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const recipeRoutes = require('./recipe.routes');
const ratingRoutes = require('./rating.routes');
const commentRoutes = require('./comment.routes');
const favoriteRoutes = require('./favorite.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes');

router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/comments', commentRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/admin', adminRoutes);
router.use('/', uploadRoutes);

module.exports = router;
