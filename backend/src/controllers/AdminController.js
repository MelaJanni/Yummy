const adminService = require('../services/AdminService');
const { success } = require('../utils/response');

class AdminController {
  async getPendingRecipes(req, res, next) {
    try {
      const result = await adminService.getPendingRecipes(req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async approveRecipe(req, res, next) {
    try {
      const { id } = req.params;
      const { requiresReview } = req.body;
      const result = await adminService.approveRecipe(parseInt(id), requiresReview);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async rejectRecipe(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await adminService.rejectRecipe(parseInt(id), reason);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const result = await adminService.getStats();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const result = await adminService.getAllUsers(req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await adminService.updateUserRole(parseInt(id), role);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteUser(parseInt(id));
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const result = await adminService.createUser(req.body);
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.updateUser(parseInt(id), req.body);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async getAllRecipes(req, res, next) {
    try {
      const result = await adminService.getAllRecipes(req.query);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.updateRecipe(parseInt(id), req.body);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteRecipe(parseInt(id));
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
