const { Op } = require('sequelize');
const { Recipe, User, Ingredient, RecipeIngredient, Step, Tag, Allergen, Diet, Rating, Favorite } = require('../db/models');
const slugify = require('../utils/slugify');
const { buildPagination } = require('../utils/paginate');

class RecipeService {
  async getAll(filters = {}) {
    const {
      query,
      cuisine,
      diet,
      allergen,
      maxMinutes,
      difficulty,
      status = 'approved',
      sort = 'recent',
      cursor,
      limit = 20
    } = filters;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } }
      ];
    }

    if (cuisine) {
      where.cuisine = cuisine;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (maxMinutes) {
      where.minutes = { [Op.lte]: parseInt(maxMinutes) };
    }

    if (cursor) {
      where.id = { [Op.lt]: parseInt(cursor) };
    }

    const include = [
      { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Allergen, as: 'allergens', attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Diet, as: 'diets', attributes: ['id', 'name'], through: { attributes: [] } }
    ];

    if (diet) {
      include.push({
        model: Diet,
        as: 'diets',
        where: { name: diet },
        attributes: [],
        through: { attributes: [] }
      });
    }

    if (allergen) {
      where['$allergens.name$'] = { [Op.ne]: allergen };
      include.push({
        model: Allergen,
        as: 'allergens',
        required: false,
        attributes: ['name'],
        through: { attributes: [] }
      });
    }

    let order = [['id', 'DESC']];
    if (sort === 'popular') {
      order = [[{ model: Favorite, as: 'favorites' }, 'createdAt', 'DESC']];
    } else if (sort === 'rating') {
      order = [[{ model: Rating, as: 'ratings' }, 'score', 'DESC']];
    }

    const total = await Recipe.count({ where, distinct: true });

    const recipes = await Recipe.findAll({
      where,
      include,
      order,
      limit: parseInt(limit) + 1,
      distinct: true
    });

    const hasMore = recipes.length > limit;
    const items = hasMore ? recipes.slice(0, limit) : recipes;

    const itemsWithStats = await Promise.all(items.map(async (recipe) => {
      const avgRating = await Rating.findOne({
        where: { recipeId: recipe.id },
        attributes: [[require('sequelize').fn('AVG', require('sequelize').col('score')), 'avg']],
        raw: true
      });

      const favCount = await Favorite.count({ where: { recipeId: recipe.id } });

      return {
        ...recipe.toJSON(),
        averageRating: avgRating?.avg ? parseFloat(avgRating.avg).toFixed(1) : null,
        favoriteCount: favCount
      };
    }));

    return buildPagination(itemsWithStats, total, cursor, parseInt(limit));
  }

  async getById(id, userId = null) {
    const recipe = await Recipe.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        {
          model: RecipeIngredient,
          as: 'recipeIngredients',
          include: [{ model: Ingredient, as: 'ingredient' }],
          order: [['order', 'ASC']]
        },
        { model: Step, as: 'steps', order: [['order', 'ASC']] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Allergen, as: 'allergens', attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Diet, as: 'diets', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    const avgRating = await Rating.findOne({
      where: { recipeId: recipe.id },
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('score')), 'avg']],
      raw: true
    });

    const totalRatings = await Rating.count({ where: { recipeId: recipe.id } });

    let isFavorite = false;
    if (userId) {
      const favorite = await Favorite.findOne({
        where: { userId, recipeId: recipe.id }
      });
      isFavorite = !!favorite;
    }

    const ingredients = recipe.recipeIngredients.map(ri => ({
      name: ri.ingredient.name,
      quantity: ri.quantity,
      unit: ri.unit,
      order: ri.order
    }));

    const recipeData = recipe.toJSON();
    delete recipeData.recipeIngredients;

    return {
      ...recipeData,
      ingredients,
      avgRating: avgRating?.avg || 0,
      totalRatings,
      isFavorite
    };
  }

  async getBySlug(slug, userId = null) {
    const recipe = await Recipe.findOne({
      where: { slug },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        {
          model: RecipeIngredient,
          as: 'recipeIngredients',
          include: [{ model: Ingredient, as: 'ingredient' }],
          order: [['order', 'ASC']]
        },
        { model: Step, as: 'steps', order: [['order', 'ASC']] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Allergen, as: 'allergens', attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Diet, as: 'diets', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    const avgRating = await Rating.findOne({
      where: { recipeId: recipe.id },
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('score')), 'avg']],
      raw: true
    });

    const ratingCount = await Rating.count({ where: { recipeId: recipe.id } });
    const favCount = await Favorite.count({ where: { recipeId: recipe.id } });

    let isFavorited = false;
    let userRating = null;

    if (userId) {
      isFavorited = await Favorite.findOne({ where: { userId, recipeId: recipe.id } }) !== null;
      userRating = await Rating.findOne({ where: { userId, recipeId: recipe.id } });
    }

    return {
      ...recipe.toJSON(),
      averageRating: avgRating?.avg ? parseFloat(avgRating.avg).toFixed(1) : null,
      ratingCount,
      favoriteCount: favCount,
      isFavorited,
      userRating: userRating ? userRating.toJSON() : null
    };
  }

  async create(userId, data) {
    const slug = slugify(data.title);
    let finalSlug = slug;
    let counter = 1;

    while (await Recipe.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const recipe = await Recipe.create({
      slug: finalSlug,
      title: data.title,
      description: data.description,
      cuisine: data.cuisine,
      difficulty: data.difficulty,
      minutes: data.minutes,
      servings: data.servings,
      imageUrl: data.imageUrl,
      authorId: userId,
      status: data.status || 'draft'
    });

    if (data.ingredients && data.ingredients.length > 0) {
      for (const ing of data.ingredients) {
        let ingredient = await Ingredient.findOne({ where: { name: ing.name } });
        if (!ingredient) {
          ingredient = await Ingredient.create({ name: ing.name });
        }
        await RecipeIngredient.create({
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          quantity: ing.quantity,
          unit: ing.unit,
          order: ing.order || 0
        });
      }
    }

    if (data.steps && data.steps.length > 0) {
      for (const step of data.steps) {
        await Step.create({
          recipeId: recipe.id,
          order: step.order,
          text: step.text
        });
      }
    }

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        await recipe.addTag(tag);
      }
    }

    if (data.allergens && data.allergens.length > 0) {
      for (const allergenName of data.allergens) {
        let allergen = await Allergen.findOne({ where: { name: allergenName } });
        if (!allergen) {
          allergen = await Allergen.create({ name: allergenName });
        }
        await recipe.addAllergen(allergen);
      }
    }

    if (data.diets && data.diets.length > 0) {
      for (const dietName of data.diets) {
        let diet = await Diet.findOne({ where: { name: dietName } });
        if (!diet) {
          diet = await Diet.create({ name: dietName });
        }
        await recipe.addDiet(diet);
      }
    }

    return this.getBySlug(finalSlug);
  }

  async update(recipeId, userId, userRole, data) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    if (recipe.authorId !== userId && userRole !== 'admin') {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (data.title) {
      const slug = slugify(data.title);
      if (slug !== recipe.slug) {
        let finalSlug = slug;
        let counter = 1;
        while (await Recipe.findOne({ where: { slug: finalSlug, id: { [Op.ne]: recipeId } } })) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        data.slug = finalSlug;
      }
    }

    await recipe.update(data);

    if (data.ingredients) {
      await RecipeIngredient.destroy({ where: { recipeId } });
      for (const ing of data.ingredients) {
        let ingredient = await Ingredient.findOne({ where: { name: ing.name } });
        if (!ingredient) {
          ingredient = await Ingredient.create({ name: ing.name });
        }
        await RecipeIngredient.create({
          recipeId,
          ingredientId: ingredient.id,
          quantity: ing.quantity,
          unit: ing.unit,
          order: ing.order || 0
        });
      }
    }

    if (data.steps) {
      await Step.destroy({ where: { recipeId } });
      for (const step of data.steps) {
        await Step.create({
          recipeId,
          order: step.order,
          text: step.text
        });
      }
    }

    if (data.tags) {
      await recipe.setTags([]);
      for (const tagName of data.tags) {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        await recipe.addTag(tag);
      }
    }

    if (data.allergens) {
      await recipe.setAllergens([]);
      for (const allergenName of data.allergens) {
        let allergen = await Allergen.findOne({ where: { name: allergenName } });
        if (!allergen) {
          allergen = await Allergen.create({ name: allergenName });
        }
        await recipe.addAllergen(allergen);
      }
    }

    if (data.diets) {
      await recipe.setDiets([]);
      for (const dietName of data.diets) {
        let diet = await Diet.findOne({ where: { name: dietName } });
        if (!diet) {
          diet = await Diet.create({ name: dietName });
        }
        await recipe.addDiet(diet);
      }
    }

    return this.getBySlug(recipe.slug);
  }

  async delete(recipeId, userId, userRole) {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      const error = new Error('Recipe not found');
      error.statusCode = 404;
      error.code = 'RECIPE_NOT_FOUND';
      throw error;
    }

    if (recipe.authorId !== userId && userRole !== 'admin') {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    await recipe.destroy();

    return { message: 'Recipe deleted successfully' };
  }

  async getMyRecipes(userId, filters = {}) {
    const {
      cursor,
      limit = 20
    } = filters;

    const where = { authorId: userId };

    if (cursor) {
      where.id = { [Op.lt]: parseInt(cursor) };
    }

    const include = [
      { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Allergen, as: 'allergens', attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Diet, as: 'diets', attributes: ['id', 'name'], through: { attributes: [] } }
    ];

    const total = await Recipe.count({ where });

    const recipes = await Recipe.findAll({
      where,
      include,
      order: [['id', 'DESC']],
      limit: parseInt(limit) + 1,
      distinct: true
    });

    const hasMore = recipes.length > limit;
    const items = hasMore ? recipes.slice(0, limit) : recipes;

    const itemsWithStats = await Promise.all(items.map(async (recipe) => {
      const avgRating = await Rating.findOne({
        where: { recipeId: recipe.id },
        attributes: [[require('sequelize').fn('AVG', require('sequelize').col('score')), 'avg']],
        raw: true
      });

      const favCount = await Favorite.count({ where: { recipeId: recipe.id } });

      return {
        ...recipe.toJSON(),
        averageRating: avgRating?.avg ? parseFloat(avgRating.avg).toFixed(1) : null,
        favoriteCount: favCount
      };
    }));

    return buildPagination(itemsWithStats, total, cursor, parseInt(limit));
  }
}

module.exports = new RecipeService();
