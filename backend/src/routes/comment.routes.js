const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createCommentSchema } = require('../validators/commentValidator');

router.post('/recipes/:recipeId', optionalAuth, validate(createCommentSchema), commentController.create);
router.delete('/:id', authenticate, commentController.delete);
router.get('/recipes/:recipeId', commentController.getByRecipe);

module.exports = router;
