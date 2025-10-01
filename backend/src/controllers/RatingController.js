const ratingService = require('../services/RatingService');
const { success } = require('../utils/response');

class RatingController {
  async create(req, res, next) {
    try {
      const { recipeId } = req.params;
      const result = await ratingService.create(parseInt(recipeId), req.user.userId, req.body);
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { recipeId } = req.params;
      const result = await ratingService.update(parseInt(recipeId), req.user.userId, req.body);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { recipeId } = req.params;
      const result = await ratingService.delete(parseInt(recipeId), req.user.userId);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getByRecipe(req, res, next) {
    try {
      const { recipeId } = req.params;
      const result = await ratingService.getByRecipe(parseInt(recipeId), req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();
