const { Comment, Recipe, User } = require('../db/models');

class CommentService {
  async create(recipeId, userId, data) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    // Guest comment (sin userId)
    if (!userId) {
      if (!data.guestName || !data.guestEmail) {
        const error = new Error('Guest name and email are required');
        error.statusCode = 400;
        error.code = 'GUEST_INFO_REQUIRED';
        throw error;
      }

      const comment = await Comment.create({
        recipeId,
        parentId: data.parentId || null,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        body: data.body
      });

      return comment;
    }

    // Authenticated user comment
    const comment = await Comment.create({
      recipeId,
      userId,
      parentId: data.parentId || null,
      body: data.body
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] }
      ]
    });

    return commentWithUser;
  }

  async delete(commentId, userId, userRole) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      const error = new Error('Comment not found');
      error.statusCode = 404;
      error.code = 'COMMENT_NOT_FOUND';
      throw error;
    }

    if (comment.userId !== userId && userRole !== 'admin') {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    await comment.destroy();

    return { message: 'Comment deleted successfully' };
  }

  async getByRecipe(recipeId, filters = {}) {
    const { cursor, limit = 20 } = filters;

    const where = { recipeId, parentId: null }; // Solo comentarios principales

    if (cursor) {
      where.id = { [require('sequelize').Op.lt]: parseInt(cursor) };
    }

    const comments = await Comment.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        {
          model: Comment,
          as: 'replies',
          include: [
            { model: User, as: 'user', attributes: ['id', 'name'] }
          ],
          order: [['createdAt', 'ASC']],
          separate: true
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) + 1
    });

    const hasMore = comments.length > limit;
    const items = hasMore ? comments.slice(0, limit) : comments;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor
    };
  }
}

module.exports = new CommentService();
