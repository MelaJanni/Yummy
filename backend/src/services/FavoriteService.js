const { Favorite, Recipe, User } = require('../db/models');

class FavoriteService {
  async toggle(recipeId, userId) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    const existing = await Favorite.findOne({ where: { recipeId, userId } });

    if (existing) {
      await existing.destroy();
      return { message: 'Favorite removed', isFavorited: false };
    } else {
      await Favorite.create({ recipeId, userId });
      return { message: 'Favorite added', isFavorited: true };
    }
  }

  async getUserFavorites(userId, filters = {}) {
    const { cursor, limit = 20 } = filters;

    const where = { userId };

    if (cursor) {
      where.recipeId = { [require('sequelize').Op.lt]: parseInt(cursor) };
    }

    const favorites = await Favorite.findAll({
      where,
      include: [
        {
          model: Recipe,
          as: 'recipe',
          include: [
            { model: User, as: 'author', attributes: ['id', 'name'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) + 1
    });

    const hasMore = favorites.length > limit;
    const items = hasMore ? favorites.slice(0, limit) : favorites;
    const nextCursor = hasMore ? items[items.length - 1].recipeId : null;

    return {
      items: items.map(f => f.recipe),
      nextCursor
    };
  }
}

module.exports = new FavoriteService();
