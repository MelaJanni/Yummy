const recipeService = require('../services/RecipeService');
const { success } = require('../utils/response');

class RecipeController {
  async getAll(req, res, next) {
    try {
      const result = await recipeService.getAll(req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || null;
      const result = await recipeService.getById(parseInt(id), userId);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const userId = req.user?.userId || null;
      const result = await recipeService.getBySlug(slug, userId);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getMyRecipes(req, res, next) {
    try {
      const result = await recipeService.getMyRecipes(req.user.userId, req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await recipeService.create(req.user.userId, req.body);
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await recipeService.update(parseInt(id), req.user.userId, req.user.role, req.body);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await recipeService.delete(parseInt(id), req.user.userId, req.user.role);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecipeController();
