const { Rating, Recipe, User } = require('../db/models');

class RatingService {
  async create(recipeId, userId, data) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    const existing = await Rating.findOne({ where: { recipeId, userId } });

    if (existing) {
      const error = new Error('Rating already exists');
      error.statusCode = 409;
      error.code = 'RATING_EXISTS';
      throw error;
    }

    const rating = await Rating.create({
      recipeId,
      userId,
      score: data.score,
      comment: data.comment
    });

    return rating;
  }

  async update(recipeId, userId, data) {
    const rating = await Rating.findOne({ where: { recipeId, userId } });

    if (!rating) {
      const error = new Error('Rating not found');
      error.statusCode = 404;
      error.code = 'RATING_NOT_FOUND';
      throw error;
    }

    await rating.update({
      score: data.score,
      comment: data.comment
    });

    return rating;
  }

  async delete(recipeId, userId) {
    const rating = await Rating.findOne({ where: { recipeId, userId } });

    if (!rating) {
      const error = new Error('Rating not found');
      error.statusCode = 404;
      error.code = 'RATING_NOT_FOUND';
      throw error;
    }

    await rating.destroy();

    return { message: 'Rating deleted successfully' };
  }

  async getByRecipe(recipeId, filters = {}) {
    const { cursor, limit = 20 } = filters;

    const where = { recipeId };

    if (cursor) {
      where.id = { [require('sequelize').Op.lt]: parseInt(cursor) };
    }

    const ratings = await Rating.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) + 1
    });

    const hasMore = ratings.length > limit;
    const items = hasMore ? ratings.slice(0, limit) : ratings;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor
    };
  }
}

module.exports = new RatingService();
