const favoriteService = require('../services/FavoriteService');
const { success } = require('../utils/response');

class FavoriteController {
  async toggle(req, res, next) {
    try {
      const { recipeId } = req.params;
      const result = await favoriteService.toggle(parseInt(recipeId), req.user.userId);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getUserFavorites(req, res, next) {
    try {
      const result = await favoriteService.getUserFavorites(req.user.userId, req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FavoriteController();
