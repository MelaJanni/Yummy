const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/RatingController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRatingSchema, updateRatingSchema } = require('../validators/ratingValidator');

router.post('/recipes/:recipeId', authenticate, validate(createRatingSchema), ratingController.create);
router.put('/recipes/:recipeId', authenticate, validate(updateRatingSchema), ratingController.update);
router.delete('/recipes/:recipeId', authenticate, ratingController.delete);
router.get('/recipes/:recipeId', ratingController.getByRecipe);

module.exports = router;
