const { Recipe, User } = require('../db/models');
const { Op } = require('sequelize');

class AdminService {
  async getPendingRecipes(filters = {}) {
    const { cursor, limit = 20 } = filters;

    const where = { status: 'pending' };

    if (cursor) {
      where.id = { [Op.lt]: parseInt(cursor) };
    }

    const recipes = await Recipe.findAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit) + 1
    });

    const hasMore = recipes.length > limit;
    const items = hasMore ? recipes.slice(0, limit) : recipes;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor
    };
  }

  async approveRecipe(recipeId, requiresReview = false) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    if (requiresReview) {
      await recipe.update({ status: 'pending', rejectionReason: null });
      return { message: 'Recipe sent back for review', recipe };
    }

    await recipe.update({ status: 'approved', rejectionReason: null });

    return { message: 'Recipe approved successfully', recipe };
  }

  async rejectRecipe(recipeId, reason) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    await recipe.update({
      status: 'rejected',
      rejectionReason: reason
    });

    return { message: 'Recipe rejected successfully', recipe };
  }

  async getStats() {
    const totalRecipes = await Recipe.count();
    const pendingRecipes = await Recipe.count({ where: { status: 'pending' } });
    const approvedRecipes = await Recipe.count({ where: { status: 'approved' } });
    const rejectedRecipes = await Recipe.count({ where: { status: 'rejected' } });
    const draftRecipes = await Recipe.count({ where: { status: 'draft' } });
    const totalUsers = await User.count();
    const adminUsers = await User.count({ where: { role: 'admin' } });

    return {
      recipes: {
        total: totalRecipes,
        pending: pendingRecipes,
        approved: approvedRecipes,
        rejected: rejectedRecipes,
        draft: draftRecipes
      },
      users: {
        total: totalUsers,
        admins: adminUsers
      }
    };
  }

  async getAllUsers(filters = {}) {
    const { cursor, limit = 20 } = filters;

    const where = {};

    if (cursor) {
      where.id = { [Op.lt]: parseInt(cursor) };
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'avatarUrl', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) + 1
    });

    const hasMore = users.length > limit;
    const items = hasMore ? users.slice(0, limit) : users;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor
    };
  }

  async updateUserRole(userId, role) {
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    await user.update({ role });

    return { message: 'User role updated successfully', user };
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    await user.destroy();

    return { message: 'User deleted successfully' };
  }

  async createUser(userData) {
    const { email, name, password, role = 'user', avatarUrl } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      error.code = 'EMAIL_IN_USE';
      throw error;
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      passwordHash: hashedPassword,
      role,
      avatarUrl: avatarUrl || null
    });

    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    return { message: 'User created successfully', user: userResponse };
  }

  async updateUser(userId, userData) {
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const { email, name, password, role, avatarUrl } = userData;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        const error = new Error('Email already in use');
        error.statusCode = 400;
        error.code = 'EMAIL_IN_USE';
        throw error;
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (password) {
      const bcrypt = require('bcryptjs');
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    return { message: 'User updated successfully', user: userResponse };
  }

  async getAllRecipes(filters = {}) {
    const { cursor, limit = 20, status } = filters;

    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (cursor) {
      where.id = { [Op.lt]: parseInt(cursor) };
    }

    const recipes = await Recipe.findAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) + 1
    });

    const hasMore = recipes.length > limit;
    const items = hasMore ? recipes.slice(0, limit) : recipes;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor
    };
  }

  async updateRecipe(recipeId, updateData) {
    const recipe = await Recipe.findByPk(recipeId, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    await recipe.update(updateData);

    return { message: 'Recipe updated successfully', recipe };
  }

  async deleteRecipe(recipeId) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    await recipe.destroy();

    return { message: 'Recipe deleted successfully' };
  }
}

module.exports = new AdminService();
