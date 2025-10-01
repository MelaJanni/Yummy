const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/RecipeController');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRecipeSchema, updateRecipeSchema } = require('../validators/recipeValidator');

router.get('/', recipeController.getAll);
router.get('/me', authenticate, recipeController.getMyRecipes);
router.get('/id/:id', authenticate, recipeController.getById);
router.get('/:slug', optionalAuth, recipeController.getBySlug);
router.post('/', authenticate, validate(createRecipeSchema), recipeController.create);
router.put('/:id', authenticate, validate(updateRecipeSchema), recipeController.update);
router.delete('/:id', authenticate, recipeController.delete);

module.exports = router;
