'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ratingSeeds = [
      { recipeSlug: 'pasta-carbonara', userEmail: 'user@demo.com', score: 5, comment: 'Excelente receta, quedó deliciosa!', createdAt: new Date('2025-09-16'), updatedAt: new Date('2025-09-16') },
      { recipeSlug: 'pasta-carbonara', userEmail: 'maria@demo.com', score: 4, comment: 'Muy buena, aunque le agregaría más queso', createdAt: new Date('2025-09-17'), updatedAt: new Date('2025-09-17') },
      { recipeSlug: 'ensalada-cesar', userEmail: 'user@demo.com', score: 5, comment: 'Perfecta para el verano', createdAt: new Date('2025-09-17'), updatedAt: new Date('2025-09-17') },
      { recipeSlug: 'ensalada-cesar', userEmail: 'admin@demo.com', score: 4, comment: 'Rica y fresca', createdAt: new Date('2025-09-18'), updatedAt: new Date('2025-09-18') },
      { recipeSlug: 'pollo-al-horno', userEmail: 'maria@demo.com', score: 5, comment: 'El pollo quedó super jugoso', createdAt: new Date('2025-09-18'), updatedAt: new Date('2025-09-18') },
      { recipeSlug: 'pollo-al-horno', userEmail: 'admin@demo.com', score: 5, comment: 'Fácil y delicioso', createdAt: new Date('2025-09-19'), updatedAt: new Date('2025-09-19') },
      { recipeSlug: 'tarta-de-manzana', userEmail: 'user@demo.com', score: 5, comment: 'La mejor tarta que probé!', createdAt: new Date('2025-09-19'), updatedAt: new Date('2025-09-19') },
      { recipeSlug: 'tarta-de-manzana', userEmail: 'admin@demo.com', score: 4, comment: 'Quedó muy rica, aunque es un poco laboriosa', createdAt: new Date('2025-09-20'), updatedAt: new Date('2025-09-20') },
      { recipeSlug: 'milanesas-napolitanas', userEmail: 'maria@demo.com', score: 5, comment: 'Un clásico que nunca falla', createdAt: new Date('2025-09-22'), updatedAt: new Date('2025-09-22') },
      { recipeSlug: 'milanesas-napolitanas', userEmail: 'admin@demo.com', score: 5, comment: 'Las mejores milanesas!', createdAt: new Date('2025-09-23'), updatedAt: new Date('2025-09-23') },
      { recipeSlug: 'empanadas-carne', userEmail: 'user@demo.com', score: 5, comment: 'Quedaron jugosísimas', createdAt: new Date('2025-09-23'), updatedAt: new Date('2025-09-23') },
      { recipeSlug: 'empanadas-carne', userEmail: 'admin@demo.com', score: 4, comment: 'Muy buenas, el repulgue es un arte', createdAt: new Date('2025-09-24'), updatedAt: new Date('2025-09-24') },
      { recipeSlug: 'pizza-casera', userEmail: 'maria@demo.com', score: 5, comment: 'Mejor que la de pizzería', createdAt: new Date('2025-09-24'), updatedAt: new Date('2025-09-24') },
      { recipeSlug: 'pizza-casera', userEmail: 'admin@demo.com', score: 5, comment: 'La masa quedó perfecta', createdAt: new Date('2025-09-25'), updatedAt: new Date('2025-09-25') },
      { recipeSlug: 'alfajores-maicena', userEmail: 'user@demo.com', score: 5, comment: 'Se deshacen en la boca', createdAt: new Date('2025-09-25'), updatedAt: new Date('2025-09-25') },
      { recipeSlug: 'alfajores-maicena', userEmail: 'admin@demo.com', score: 5, comment: 'Los mejores alfajores caseros!', createdAt: new Date('2025-09-26'), updatedAt: new Date('2025-09-26') }
    ];

    const commentSeeds = [
      { recipeSlug: 'pasta-carbonara', userEmail: 'maria@demo.com', body: 'Hola! Puedo usar crema en vez de hacer la salsa con huevo?', createdAt: new Date('2025-09-16T10:00:00'), updatedAt: new Date('2025-09-16T10:00:00') },
      { recipeSlug: 'pasta-carbonara', userEmail: 'user@demo.com', body: 'La tradicional va con huevo, pero podés probar con crema si querés. Cambia el sabor!', createdAt: new Date('2025-09-16T11:30:00'), updatedAt: new Date('2025-09-16T11:30:00') },
      { recipeSlug: 'pasta-carbonara', userEmail: 'admin@demo.com', body: 'Qué tipo de queso recomiendan? Parmesano o reggianito?', createdAt: new Date('2025-09-17T14:00:00'), updatedAt: new Date('2025-09-17T14:00:00') },
      { recipeSlug: 'ensalada-cesar', userEmail: 'admin@demo.com', body: 'Se puede preparar el aderezo con anticipación?', createdAt: new Date('2025-09-17T09:00:00'), updatedAt: new Date('2025-09-17T09:00:00') },
      { recipeSlug: 'ensalada-cesar', userEmail: 'maria@demo.com', body: 'Sí! Dura hasta 3 días en la heladera', createdAt: new Date('2025-09-17T10:00:00'), updatedAt: new Date('2025-09-17T10:00:00') },
      { recipeSlug: 'pollo-al-horno', userEmail: 'admin@demo.com', body: 'Funciona con muslos de pollo también?', createdAt: new Date('2025-09-18T15:00:00'), updatedAt: new Date('2025-09-18T15:00:00') },
      { recipeSlug: 'pollo-al-horno', userEmail: 'user@demo.com', body: 'Sí, pero ajustá el tiempo de cocción a unos 45 minutos', createdAt: new Date('2025-09-18T16:00:00'), updatedAt: new Date('2025-09-18T16:00:00') },
      { recipeSlug: 'pollo-al-horno', userEmail: 'maria@demo.com', body: 'Yo le agrego romero y limón, queda espectacular', createdAt: new Date('2025-09-19T12:00:00'), updatedAt: new Date('2025-09-19T12:00:00') },
      { recipeSlug: 'tarta-de-manzana', userEmail: 'admin@demo.com', body: 'Puedo usar manzanas verdes?', createdAt: new Date('2025-09-19T10:00:00'), updatedAt: new Date('2025-09-19T10:00:00') },
      { recipeSlug: 'tarta-de-manzana', userEmail: 'maria@demo.com', body: 'Sí! Las verdes quedan más ácidas, agregá un poco más de azúcar', createdAt: new Date('2025-09-19T11:00:00'), updatedAt: new Date('2025-09-19T11:00:00') },
      { recipeSlug: 'milanesas-napolitanas', userEmail: 'admin@demo.com', body: 'Qué salsa de tomate recomiendan?', createdAt: new Date('2025-09-22T13:00:00'), updatedAt: new Date('2025-09-22T13:00:00') },
      { recipeSlug: 'milanesas-napolitanas', userEmail: 'user@demo.com', body: 'Yo uso salsa casera con tomate, ajo y albahaca. Queda perfecta!', createdAt: new Date('2025-09-22T14:00:00'), updatedAt: new Date('2025-09-22T14:00:00') },
      { recipeSlug: 'milanesas-napolitanas', userEmail: 'maria@demo.com', body: 'Las hice ayer y quedaron increíbles!', createdAt: new Date('2025-09-23T10:00:00'), updatedAt: new Date('2025-09-23T10:00:00') },
      { recipeSlug: 'empanadas-carne', userEmail: 'admin@demo.com', body: 'Cuántas tapas salen con esa cantidad de masa?', createdAt: new Date('2025-09-23T09:00:00'), updatedAt: new Date('2025-09-23T09:00:00') },
      { recipeSlug: 'empanadas-carne', userEmail: 'maria@demo.com', body: 'Aproximadamente 12-15 empanadas dependiendo del tamaño', createdAt: new Date('2025-09-23T10:00:00'), updatedAt: new Date('2025-09-23T10:00:00') },
      { recipeSlug: 'empanadas-carne', userEmail: 'user@demo.com', body: 'Yo siempre le agrego huevo duro picado al relleno', createdAt: new Date('2025-09-24T11:00:00'), updatedAt: new Date('2025-09-24T11:00:00') },
      { recipeSlug: 'pizza-casera', userEmail: 'admin@demo.com', body: 'Puedo hacer la masa la noche anterior?', createdAt: new Date('2025-09-24T16:00:00'), updatedAt: new Date('2025-09-24T16:00:00') },
      { recipeSlug: 'pizza-casera', userEmail: 'user@demo.com', body: 'Sí! Dejala en la heladera cubierta. Sacala 30 min antes de usar', createdAt: new Date('2025-09-24T17:00:00'), updatedAt: new Date('2025-09-24T17:00:00') },
      { recipeSlug: 'pizza-casera', userEmail: 'maria@demo.com', body: 'Excelente receta! La masa quedó crocante y esponjosa', createdAt: new Date('2025-09-25T13:00:00'), updatedAt: new Date('2025-09-25T13:00:00') },
      { recipeSlug: 'alfajores-maicena', userEmail: 'admin@demo.com', body: 'Cuánto tiempo duran guardados?', createdAt: new Date('2025-09-25T10:00:00'), updatedAt: new Date('2025-09-25T10:00:00') },
      { recipeSlug: 'alfajores-maicena', userEmail: 'maria@demo.com', body: 'En recipiente hermético duran hasta 2 semanas', createdAt: new Date('2025-09-25T11:00:00'), updatedAt: new Date('2025-09-25T11:00:00') },
  { recipeSlug: 'alfajores-maicena', userEmail: 'user@demo.com', body: 'También podés congelarlos!', createdAt: new Date('2025-09-26T09:00:00'), updatedAt: new Date('2025-09-26T09:00:00') }
    ];

    const favoriteSeeds = [
      { userEmail: 'user@demo.com', recipeSlug: 'pasta-carbonara', createdAt: new Date('2025-09-16') },
      { userEmail: 'user@demo.com', recipeSlug: 'pollo-al-horno', createdAt: new Date('2025-09-17') },
      { userEmail: 'user@demo.com', recipeSlug: 'tarta-de-manzana', createdAt: new Date('2025-09-18') },
      { userEmail: 'user@demo.com', recipeSlug: 'milanesas-napolitanas', createdAt: new Date('2025-09-22') },
      { userEmail: 'user@demo.com', recipeSlug: 'alfajores-maicena', createdAt: new Date('2025-09-25') },
      { userEmail: 'maria@demo.com', recipeSlug: 'pasta-carbonara', createdAt: new Date('2025-09-17') },
      { userEmail: 'maria@demo.com', recipeSlug: 'ensalada-cesar', createdAt: new Date('2025-09-18') },
      { userEmail: 'maria@demo.com', recipeSlug: 'empanadas-carne', createdAt: new Date('2025-09-23') },
      { userEmail: 'maria@demo.com', recipeSlug: 'pizza-casera', createdAt: new Date('2025-09-24') },
      { userEmail: 'admin@demo.com', recipeSlug: 'ensalada-cesar', createdAt: new Date('2025-09-18') },
      { userEmail: 'admin@demo.com', recipeSlug: 'pollo-al-horno', createdAt: new Date('2025-09-19') },
      { userEmail: 'admin@demo.com', recipeSlug: 'milanesas-napolitanas', createdAt: new Date('2025-09-23') }
    ];

    const userEmails = [...new Set([
      ...ratingSeeds.map((seed) => seed.userEmail),
      ...commentSeeds.map((seed) => seed.userEmail),
      ...favoriteSeeds.map((seed) => seed.userEmail)
    ])];

    const recipeSlugs = [...new Set([
      ...ratingSeeds.map((seed) => seed.recipeSlug),
      ...commentSeeds.map((seed) => seed.recipeSlug),
      ...favoriteSeeds.map((seed) => seed.recipeSlug)
    ])];

    const userPlaceholders = userEmails.map(() => '?').join(', ');
    const [userRows] = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN (${userPlaceholders})`,
      { replacements: userEmails }
    );

    const userIdByEmail = {};
    userRows.forEach(({ id, email }) => {
      userIdByEmail[email] = id;
    });

    userEmails.forEach((email) => {
      if (!userIdByEmail[email]) {
        throw new Error(`No se encontró el usuario con email ${email} necesario para sembrar ratings/comentarios.`);
      }
    });

    const recipePlaceholders = recipeSlugs.map(() => '?').join(', ');
    const [recipeRows] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM recipes WHERE slug IN (${recipePlaceholders})`,
      { replacements: recipeSlugs }
    );

    const recipeIdBySlug = {};
    recipeRows.forEach(({ id, slug }) => {
      recipeIdBySlug[slug] = id;
    });

    recipeSlugs.forEach((slug) => {
      if (!recipeIdBySlug[slug]) {
        throw new Error(`No se encontró la receta con slug ${slug}. Ejecuta antes el seeder de recetas.`);
      }
    });

    const ratingsPayload = ratingSeeds.map(({ recipeSlug, userEmail, ...rest }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      userId: userIdByEmail[userEmail],
      ...rest
    }));

    if (ratingsPayload.length) {
      await queryInterface.bulkInsert('ratings', ratingsPayload, {
        updateOnDuplicate: ['score', 'comment', 'updatedAt']
      });
    }

    const commentsPayload = commentSeeds.map(({ recipeSlug, userEmail, ...rest }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      userId: userIdByEmail[userEmail],
      ...rest
    }));

    if (commentsPayload.length) {
      const commentRecipeIds = [...new Set(commentsPayload.map((comment) => comment.recipeId))];
      const commentPlaceholders = commentRecipeIds.map(() => '?').join(', ');
      const [existingComments] = await queryInterface.sequelize.query(
        `SELECT recipeId, userId, body FROM comments WHERE recipeId IN (${commentPlaceholders})`,
        { replacements: commentRecipeIds }
      );

      const existingCommentKeys = new Set(
        existingComments.map(({ recipeId, userId, body }) => `${recipeId}|${userId}|${body}`)
      );

      const commentsToInsert = commentsPayload.filter(({ recipeId, userId, body }) => {
        const key = `${recipeId}|${userId}|${body}`;
        if (existingCommentKeys.has(key)) {
          return false;
        }
        existingCommentKeys.add(key);
        return true;
      });

      if (commentsToInsert.length) {
        await queryInterface.bulkInsert('comments', commentsToInsert);
      }
    }

    const favoritesPayload = favoriteSeeds.map(({ recipeSlug, userEmail, ...rest }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      userId: userIdByEmail[userEmail],
      ...rest
    }));

    if (favoritesPayload.length) {
      await queryInterface.bulkInsert('favorites', favoritesPayload, {
        updateOnDuplicate: ['createdAt']
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('favorites', null, {});
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('ratings', null, {});
  }
};
