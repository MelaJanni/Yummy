const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/FavoriteController');
const { authenticate } = require('../middlewares/auth');

router.post('/recipes/:recipeId', authenticate, favoriteController.toggle);
router.get('/me', authenticate, favoriteController.getUserFavorites);

module.exports = router;
