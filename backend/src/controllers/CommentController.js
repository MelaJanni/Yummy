const commentService = require('../services/CommentService');
const { success } = require('../utils/response');

class CommentController {
  async create(req, res, next) {
    try {
      const { recipeId } = req.params;
      const userId = req.user?.userId || null;
      const result = await commentService.create(parseInt(recipeId), userId, req.body);
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await commentService.delete(parseInt(id), req.user.userId, req.user.role);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getByRecipe(req, res, next) {
    try {
      const { recipeId } = req.params;
      const result = await commentService.getByRecipe(parseInt(recipeId), req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
