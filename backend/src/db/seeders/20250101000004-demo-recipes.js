'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const recipeSeeds = [
      {
        slug: 'pasta-carbonara',
        title: 'Pasta Carbonara',
        description: 'Clásica pasta italiana con salsa cremosa de huevo y queso',
        cuisine: 'Italiana',
        difficulty: 'medium',
        minutes: 30,
        servings: 4,
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
        authorEmail: 'user@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-15'),
        updatedAt: new Date('2025-09-15')
      },
      {
        slug: 'ensalada-cesar',
        title: 'Ensalada César',
        description: 'Fresca ensalada con aderezo césar casero',
        cuisine: 'Americana',
        difficulty: 'easy',
        minutes: 15,
        servings: 2,
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
        authorEmail: 'maria@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-16'),
        updatedAt: new Date('2025-09-16')
      },
      {
        slug: 'pollo-al-horno',
        title: 'Pollo al horno con papas',
        description: 'Jugoso pollo al horno con papas doradas',
        cuisine: 'Casera',
        difficulty: 'easy',
        minutes: 60,
        servings: 6,
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop',
        authorEmail: 'user@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-17'),
        updatedAt: new Date('2025-09-17')
      },
      {
        slug: 'tarta-de-manzana',
        title: 'Tarta de manzana',
        description: 'Deliciosa tarta de manzana con canela',
        cuisine: 'Repostería',
        difficulty: 'hard',
        minutes: 90,
        servings: 8,
        imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&h=600&fit=crop',
        authorEmail: 'maria@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-18'),
        updatedAt: new Date('2025-09-18')
      },
      {
        slug: 'sopa-de-verduras',
        title: 'Sopa de verduras',
        description: 'Nutritiva sopa casera de verduras frescas',
        cuisine: 'Casera',
        difficulty: 'easy',
        minutes: 40,
        servings: 4,
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
        authorEmail: 'user@demo.com',
        status: 'pending',
        createdAt: new Date('2025-09-19'),
        updatedAt: new Date('2025-09-19')
      },
      {
        slug: 'brownies-chocolate',
        title: 'Brownies de chocolate',
        description: 'Brownies densos y chocolatosos',
        cuisine: 'Repostería',
        difficulty: 'medium',
        minutes: 45,
        servings: 12,
        imageUrl: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&h=600&fit=crop',
        authorEmail: 'maria@demo.com',
        status: 'draft',
        createdAt: new Date('2025-09-20'),
        updatedAt: new Date('2025-09-20')
      },
      {
        slug: 'milanesas-napolitanas',
        title: 'Milanesas a la napolitana',
        description: 'Clásicas milanesas argentinas con salsa de tomate, jamón y queso',
        cuisine: 'Argentina',
        difficulty: 'medium',
        minutes: 35,
        servings: 4,
        imageUrl: 'https://images.pexels.com/photos/5175516/pexels-photo-5175516.jpeg?auto=compress&cs=tinysrgb&w=800',
        authorEmail: 'user@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-21'),
        updatedAt: new Date('2025-09-21')
      },
      {
        slug: 'empanadas-carne',
        title: 'Empanadas de carne',
        description: 'Empanadas jugosas al horno con carne picada, cebolla y especias',
        cuisine: 'Argentina',
        difficulty: 'hard',
        minutes: 90,
        servings: 12,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
        authorEmail: 'maria@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-22'),
        updatedAt: new Date('2025-09-22')
      },
      {
        slug: 'pizza-casera',
        title: 'Pizza casera',
        description: 'Pizza con masa casera, salsa de tomate y tus ingredientes favoritos',
        cuisine: 'Italiana',
        difficulty: 'medium',
        minutes: 120,
        servings: 6,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
        authorEmail: 'user@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-23'),
        updatedAt: new Date('2025-09-23')
      },
      {
        slug: 'alfajores-maicena',
        title: 'Alfajores de maicena',
        description: 'Suaves alfajores argentinos rellenos de dulce de leche',
        cuisine: 'Argentina',
        difficulty: 'medium',
        minutes: 60,
        servings: 20,
        imageUrl: 'https://images.pexels.com/photos/6210749/pexels-photo-6210749.jpeg?auto=compress&cs=tinysrgb&w=800',
        authorEmail: 'maria@demo.com',
        status: 'approved',
        createdAt: new Date('2025-09-24'),
        updatedAt: new Date('2025-09-24')
      }
    ];

    const authorEmails = [...new Set(recipeSeeds.map((recipe) => recipe.authorEmail))];
    const authorPlaceholders = authorEmails.map(() => '?').join(', ');
    const [userRows] = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN (${authorPlaceholders})`,
      { replacements: authorEmails }
    );

    const userIdByEmail = {};
    userRows.forEach(({ id, email }) => {
      userIdByEmail[email] = id;
    });

    authorEmails.forEach((email) => {
      if (!userIdByEmail[email]) {
        throw new Error(`No se encontró el usuario con email ${email}. Ejecuta primero el seeder de usuarios.`);
      }
    });

    const recipesPayload = recipeSeeds.map(({ authorEmail, ...rest }) => ({
      ...rest,
      authorId: userIdByEmail[authorEmail]
    }));

    await queryInterface.bulkInsert('recipes', recipesPayload, {
      updateOnDuplicate: [
        'title',
        'description',
        'cuisine',
        'difficulty',
        'minutes',
        'servings',
        'imageUrl',
        'authorId',
        'status',
        'updatedAt'
      ]
    });

    const recipeSlugs = recipeSeeds.map((recipe) => recipe.slug);
    const recipePlaceholders = recipeSlugs.map(() => '?').join(', ');
    const [recipeRows] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM recipes WHERE slug IN (${recipePlaceholders})`,
      { replacements: recipeSlugs }
    );

    const recipeIdBySlug = {};
    recipeRows.forEach(({ id, slug }) => {
      recipeIdBySlug[slug] = id;
    });

    if (Object.keys(recipeIdBySlug).length !== recipeSeeds.length) {
      throw new Error('No se pudieron recuperar todos los IDs de recetas recién sembradas.');
    }

    const { Op } = Sequelize;
    const recipeIds = Object.values(recipeIdBySlug);

    await Promise.all([
      queryInterface.bulkDelete('recipe_ingredients', { recipeId: { [Op.in]: recipeIds } }, {}),
      queryInterface.bulkDelete('steps', { recipeId: { [Op.in]: recipeIds } }, {}),
      queryInterface.bulkDelete('recipe_tags', { recipeId: { [Op.in]: recipeIds } }, {}),
      queryInterface.bulkDelete('recipe_allergens', { recipeId: { [Op.in]: recipeIds } }, {}),
      queryInterface.bulkDelete('recipe_diets', { recipeId: { [Op.in]: recipeIds } }, {})
    ]);

    const recipeIngredientSeeds = [
      { recipeSlug: 'pasta-carbonara', ingredientName: 'Fideos', quantity: 400, unit: 'g', order: 1 },
      { recipeSlug: 'pasta-carbonara', ingredientName: 'Huevos', quantity: 4, unit: 'unidades', order: 2 },
      { recipeSlug: 'pasta-carbonara', ingredientName: 'Queso rallado', quantity: 100, unit: 'g', order: 3 },
      { recipeSlug: 'pasta-carbonara', ingredientName: 'Sal fina', quantity: 1, unit: 'pizca', order: 4 },

      { recipeSlug: 'ensalada-cesar', ingredientName: 'Espinaca', quantity: 200, unit: 'g', order: 1 },
      { recipeSlug: 'ensalada-cesar', ingredientName: 'Queso rallado', quantity: 50, unit: 'g', order: 2 },
      { recipeSlug: 'ensalada-cesar', ingredientName: 'Huevos', quantity: 1, unit: 'unidad', order: 3 },

      { recipeSlug: 'pollo-al-horno', ingredientName: 'Pollo', quantity: 1500, unit: 'g', order: 1 },
      { recipeSlug: 'pollo-al-horno', ingredientName: 'Papa', quantity: 800, unit: 'g', order: 2 },
      { recipeSlug: 'pollo-al-horno', ingredientName: 'Aceite de oliva', quantity: 3, unit: 'cdas', order: 3 },
      { recipeSlug: 'pollo-al-horno', ingredientName: 'Ajo', quantity: 4, unit: 'dientes', order: 4 },

      { recipeSlug: 'tarta-de-manzana', ingredientName: 'Harina 0000', quantity: 300, unit: 'g', order: 1 },
      { recipeSlug: 'tarta-de-manzana', ingredientName: 'Azúcar', quantity: 150, unit: 'g', order: 2 },
      { recipeSlug: 'tarta-de-manzana', ingredientName: 'Huevos', quantity: 2, unit: 'unidades', order: 3 },
      { recipeSlug: 'tarta-de-manzana', ingredientName: 'Manteca', quantity: 100, unit: 'g', order: 4 },

      { recipeSlug: 'sopa-de-verduras', ingredientName: 'Papa', quantity: 3, unit: 'unidades', order: 1 },
      { recipeSlug: 'sopa-de-verduras', ingredientName: 'Zanahoria', quantity: 2, unit: 'unidades', order: 2 },
      { recipeSlug: 'sopa-de-verduras', ingredientName: 'Tomate', quantity: 1, unit: 'unidad', order: 3 },
      { recipeSlug: 'sopa-de-verduras', ingredientName: 'Ajo', quantity: 2, unit: 'dientes', order: 4 },

      { recipeSlug: 'brownies-chocolate', ingredientName: 'Harina 0000', quantity: 200, unit: 'g', order: 1 },
      { recipeSlug: 'brownies-chocolate', ingredientName: 'Manteca', quantity: 200, unit: 'g', order: 2 },
      { recipeSlug: 'brownies-chocolate', ingredientName: 'Huevos', quantity: 4, unit: 'unidades', order: 3 },
      { recipeSlug: 'brownies-chocolate', ingredientName: 'Azúcar', quantity: 150, unit: 'g', order: 4 },

      { recipeSlug: 'milanesas-napolitanas', ingredientName: 'Pollo', quantity: 800, unit: 'g', order: 1 },
      { recipeSlug: 'milanesas-napolitanas', ingredientName: 'Huevos', quantity: 2, unit: 'unidades', order: 2 },
      { recipeSlug: 'milanesas-napolitanas', ingredientName: 'Queso rallado', quantity: 200, unit: 'g', order: 3 },
      { recipeSlug: 'milanesas-napolitanas', ingredientName: 'Tomate', quantity: 2, unit: 'unidades', order: 4 },

      { recipeSlug: 'empanadas-carne', ingredientName: 'Harina 0000', quantity: 600, unit: 'g', order: 1 },
      { recipeSlug: 'empanadas-carne', ingredientName: 'Carne picada', quantity: 500, unit: 'g', order: 2 },
      { recipeSlug: 'empanadas-carne', ingredientName: 'Cebolla', quantity: 3, unit: 'unidades', order: 3 },
      { recipeSlug: 'empanadas-carne', ingredientName: 'Huevos', quantity: 2, unit: 'unidades', order: 4 },

      { recipeSlug: 'pizza-casera', ingredientName: 'Harina 0000', quantity: 500, unit: 'g', order: 1 },
      { recipeSlug: 'pizza-casera', ingredientName: 'Aceite de oliva', quantity: 50, unit: 'ml', order: 2 },
      { recipeSlug: 'pizza-casera', ingredientName: 'Tomate', quantity: 2, unit: 'unidades', order: 3 },
      { recipeSlug: 'pizza-casera', ingredientName: 'Queso rallado', quantity: 300, unit: 'g', order: 4 },

  { recipeSlug: 'alfajores-maicena', ingredientName: 'Harina 0000', quantity: 200, unit: 'g', order: 1 },
  { recipeSlug: 'alfajores-maicena', ingredientName: 'Azúcar', quantity: 100, unit: 'g', order: 2 },
  { recipeSlug: 'alfajores-maicena', ingredientName: 'Huevos', quantity: 2, unit: 'yemas', order: 3 },
  { recipeSlug: 'alfajores-maicena', ingredientName: 'Manteca', quantity: 80, unit: 'g', order: 4 }
    ];

    const ingredientNames = [...new Set(recipeIngredientSeeds.map((seed) => seed.ingredientName))];
    const ingredientPlaceholders = ingredientNames.map(() => '?').join(', ');
    const [ingredientRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM ingredients WHERE name IN (${ingredientPlaceholders})`,
      { replacements: ingredientNames }
    );

    const ingredientIdByName = {};
    ingredientRows.forEach(({ id, name }) => {
      ingredientIdByName[name] = id;
    });

    ingredientNames.forEach((name) => {
      if (!ingredientIdByName[name]) {
        throw new Error(`No se encontró el ingrediente "${name}". Ejecuta antes el seeder de ingredientes.`);
      }
    });

    const recipeIngredientsPayload = recipeIngredientSeeds.map(({ recipeSlug, ingredientName, ...rest }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      ingredientId: ingredientIdByName[ingredientName],
      ...rest
    }));

    await queryInterface.bulkInsert('recipe_ingredients', recipeIngredientsPayload);

    const stepSeeds = [
      { recipeSlug: 'pasta-carbonara', order: 1, text: 'Cocinar la pasta en agua con sal según las instrucciones del paquete.' },
      { recipeSlug: 'pasta-carbonara', order: 2, text: 'Batir los huevos con el queso rallado y una pizca de pimienta.' },
      { recipeSlug: 'pasta-carbonara', order: 3, text: 'Escurrir la pasta y mezclar con la mezcla de huevo fuera del fuego.' },
      { recipeSlug: 'pasta-carbonara', order: 4, text: 'Servir inmediatamente con queso extra por encima.' },

      { recipeSlug: 'ensalada-cesar', order: 1, text: 'Lavar y cortar la lechuga en trozos.' },
      { recipeSlug: 'ensalada-cesar', order: 2, text: 'Preparar el aderezo con huevo, aceite y queso.' },
      { recipeSlug: 'ensalada-cesar', order: 3, text: 'Mezclar todo y servir con crutones.' },

      { recipeSlug: 'pollo-al-horno', order: 1, text: 'Precalentar el horno a 200°C.' },
      { recipeSlug: 'pollo-al-horno', order: 2, text: 'Sazonar el pollo con sal, pimienta y ajo.' },
      { recipeSlug: 'pollo-al-horno', order: 3, text: 'Pelar y cortar las papas en cuartos.' },
      { recipeSlug: 'pollo-al-horno', order: 4, text: 'Colocar todo en una fuente y hornear por 60 minutos.' },

      { recipeSlug: 'tarta-de-manzana', order: 1, text: 'Preparar la masa mezclando harina, manteca y huevos.' },
      { recipeSlug: 'tarta-de-manzana', order: 2, text: 'Dejar reposar la masa en la heladera por 30 minutos.' },
      { recipeSlug: 'tarta-de-manzana', order: 3, text: 'Pelar y cortar las manzanas en láminas finas.' },
      { recipeSlug: 'tarta-de-manzana', order: 4, text: 'Estirar la masa, rellenar con manzanas, azúcar y canela.' },
      { recipeSlug: 'tarta-de-manzana', order: 5, text: 'Hornear a 180°C por 50 minutos hasta dorar.' },

      { recipeSlug: 'sopa-de-verduras', order: 1, text: 'Pelar y cortar todas las verduras en cubos.' },
      { recipeSlug: 'sopa-de-verduras', order: 2, text: 'Rehogar en aceite la cebolla y el ajo.' },
      { recipeSlug: 'sopa-de-verduras', order: 3, text: 'Agregar las verduras y 1.5 litros de agua.' },
      { recipeSlug: 'sopa-de-verduras', order: 4, text: 'Cocinar a fuego medio por 30 minutos.' },
      { recipeSlug: 'sopa-de-verduras', order: 5, text: 'Salpimentar y servir caliente.' },

      { recipeSlug: 'brownies-chocolate', order: 1, text: 'Derretir el chocolate con la manteca a baño maría.' },
      { recipeSlug: 'brownies-chocolate', order: 2, text: 'Batir los huevos con el azúcar hasta punto letra.' },
      { recipeSlug: 'brownies-chocolate', order: 3, text: 'Incorporar el chocolate derretido y la harina.' },
      { recipeSlug: 'brownies-chocolate', order: 4, text: 'Verter en molde enmantecado y hornear 25 minutos a 180°C.' },

      { recipeSlug: 'milanesas-napolitanas', order: 1, text: 'Aplanar las milanesas y pasar por huevo batido y pan rallado.' },
      { recipeSlug: 'milanesas-napolitanas', order: 2, text: 'Freír en aceite caliente hasta dorar de ambos lados.' },
      { recipeSlug: 'milanesas-napolitanas', order: 3, text: 'Colocar en fuente para horno, cubrir con salsa de tomate.' },
      { recipeSlug: 'milanesas-napolitanas', order: 4, text: 'Agregar jamón y queso. Gratinar 10 minutos.' },

      { recipeSlug: 'empanadas-carne', order: 1, text: 'Preparar la masa mezclando harina, grasa y agua tibia.' },
      { recipeSlug: 'empanadas-carne', order: 2, text: 'Rehogar cebolla picada, agregar carne picada y condimentar.' },
      { recipeSlug: 'empanadas-carne', order: 3, text: 'Dejar enfriar el relleno completamente.' },
      { recipeSlug: 'empanadas-carne', order: 4, text: 'Estirar la masa, cortar discos y rellenar.' },
      { recipeSlug: 'empanadas-carne', order: 5, text: 'Repulgar y pintar con huevo. Hornear 25 minutos a 200°C.' },

      { recipeSlug: 'pizza-casera', order: 1, text: 'Mezclar harina, levadura, agua y sal. Amasar 10 minutos.' },
      { recipeSlug: 'pizza-casera', order: 2, text: 'Dejar leudar 1 hora hasta duplicar tamaño.' },
      { recipeSlug: 'pizza-casera', order: 3, text: 'Estirar la masa en molde para pizza.' },
      { recipeSlug: 'pizza-casera', order: 4, text: 'Agregar salsa de tomate, queso y los ingredientes deseados.' },
      { recipeSlug: 'pizza-casera', order: 5, text: 'Hornear a temperatura máxima por 15-20 minutos.' },

      { recipeSlug: 'alfajores-maicena', order: 1, text: 'Mezclar maicena, manteca, yemas y azúcar impalpable.' },
      { recipeSlug: 'alfajores-maicena', order: 2, text: 'Formar masa y estirar de 5mm de espesor.' },
      { recipeSlug: 'alfajores-maicena', order: 3, text: 'Cortar discos y hornear 12 minutos a 180°C.' },
      { recipeSlug: 'alfajores-maicena', order: 4, text: 'Dejar enfriar y rellenar con dulce de leche.' },
      { recipeSlug: 'alfajores-maicena', order: 5, text: 'Pasar por coco rallado los bordes.' }
    ];

    const stepsPayload = stepSeeds.map(({ recipeSlug, ...rest }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      ...rest
    }));

    await queryInterface.bulkInsert('steps', stepsPayload);

    const recipeTagSeeds = [
      { recipeSlug: 'pasta-carbonara', tagName: 'Almuerzo' },
      { recipeSlug: 'pasta-carbonara', tagName: 'Cena' },
      { recipeSlug: 'ensalada-cesar', tagName: 'Almuerzo' },
      { recipeSlug: 'ensalada-cesar', tagName: 'Saludable' },
      { recipeSlug: 'pollo-al-horno', tagName: 'Cena' },
      { recipeSlug: 'pollo-al-horno', tagName: 'Comfort food' },
      { recipeSlug: 'tarta-de-manzana', tagName: 'Postre' },
      { recipeSlug: 'sopa-de-verduras', tagName: 'Cena' },
      { recipeSlug: 'sopa-de-verduras', tagName: 'Saludable' },
      { recipeSlug: 'brownies-chocolate', tagName: 'Postre' },
      { recipeSlug: 'milanesas-napolitanas', tagName: 'Cena' },
      { recipeSlug: 'milanesas-napolitanas', tagName: 'Festivo' },
      { recipeSlug: 'empanadas-carne', tagName: 'Snack' },
      { recipeSlug: 'empanadas-carne', tagName: 'Festivo' },
      { recipeSlug: 'pizza-casera', tagName: 'Cena' },
      { recipeSlug: 'alfajores-maicena', tagName: 'Postre' },
      { recipeSlug: 'alfajores-maicena', tagName: 'Snack' }
    ];

    const tagNames = [...new Set(recipeTagSeeds.map((seed) => seed.tagName))];
    const tagPlaceholders = tagNames.map(() => '?').join(', ');
    const [tagRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM tags WHERE name IN (${tagPlaceholders})`,
      { replacements: tagNames }
    );

    const tagIdByName = {};
    tagRows.forEach(({ id, name }) => {
      tagIdByName[name] = id;
    });

    tagNames.forEach((name) => {
      if (!tagIdByName[name]) {
        throw new Error(`No se encontró el tag "${name}".`);
      }
    });

    const recipeTagsPayload = recipeTagSeeds.map(({ recipeSlug, tagName }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      tagId: tagIdByName[tagName]
    }));

    await queryInterface.bulkInsert('recipe_tags', recipeTagsPayload);

    const recipeAllergenSeeds = [
      { recipeSlug: 'pasta-carbonara', allergenName: 'Gluten' },
      { recipeSlug: 'pasta-carbonara', allergenName: 'Lácteos' },
      { recipeSlug: 'pasta-carbonara', allergenName: 'Huevo' },
      { recipeSlug: 'ensalada-cesar', allergenName: 'Lácteos' },
      { recipeSlug: 'ensalada-cesar', allergenName: 'Huevo' },
      { recipeSlug: 'tarta-de-manzana', allergenName: 'Gluten' },
      { recipeSlug: 'tarta-de-manzana', allergenName: 'Huevo' },
      { recipeSlug: 'brownies-chocolate', allergenName: 'Gluten' },
      { recipeSlug: 'brownies-chocolate', allergenName: 'Huevo' },
      { recipeSlug: 'milanesas-napolitanas', allergenName: 'Gluten' },
      { recipeSlug: 'milanesas-napolitanas', allergenName: 'Lácteos' },
      { recipeSlug: 'empanadas-carne', allergenName: 'Gluten' },
      { recipeSlug: 'pizza-casera', allergenName: 'Gluten' },
      { recipeSlug: 'pizza-casera', allergenName: 'Lácteos' },
      { recipeSlug: 'alfajores-maicena', allergenName: 'Gluten' },
      { recipeSlug: 'alfajores-maicena', allergenName: 'Huevo' }
    ];

    const allergenNames = [...new Set(recipeAllergenSeeds.map((seed) => seed.allergenName))];
    const allergenPlaceholders = allergenNames.map(() => '?').join(', ');
    const [allergenRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM allergens WHERE name IN (${allergenPlaceholders})`,
      { replacements: allergenNames }
    );

    const allergenIdByName = {};
    allergenRows.forEach(({ id, name }) => {
      allergenIdByName[name] = id;
    });

    allergenNames.forEach((name) => {
      if (!allergenIdByName[name]) {
        throw new Error(`No se encontró el alérgeno "${name}".`);
      }
    });

    const recipeAllergensPayload = recipeAllergenSeeds.map(({ recipeSlug, allergenName }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      allergenId: allergenIdByName[allergenName]
    }));

    await queryInterface.bulkInsert('recipe_allergens', recipeAllergensPayload);

    const recipeDietSeeds = [
      { recipeSlug: 'ensalada-cesar', dietName: 'Vegetariana' },
      { recipeSlug: 'sopa-de-verduras', dietName: 'Vegetariana' },
      { recipeSlug: 'sopa-de-verduras', dietName: 'Vegana' }
    ];

    const dietNames = [...new Set(recipeDietSeeds.map((seed) => seed.dietName))];
    const dietPlaceholders = dietNames.map(() => '?').join(', ');
    const [dietRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM diets WHERE name IN (${dietPlaceholders})`,
      { replacements: dietNames }
    );

    const dietIdByName = {};
    dietRows.forEach(({ id, name }) => {
      dietIdByName[name] = id;
    });

    dietNames.forEach((name) => {
      if (!dietIdByName[name]) {
        throw new Error(`No se encontró la dieta "${name}".`);
      }
    });

    const recipeDietsPayload = recipeDietSeeds.map(({ recipeSlug, dietName }) => ({
      recipeId: recipeIdBySlug[recipeSlug],
      dietId: dietIdByName[dietName]
    }));

    await queryInterface.bulkInsert('recipe_diets', recipeDietsPayload);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('recipe_diets', null, {});
    await queryInterface.bulkDelete('recipe_allergens', null, {});
    await queryInterface.bulkDelete('recipe_tags', null, {});
    await queryInterface.bulkDelete('steps', null, {});
    await queryInterface.bulkDelete('recipe_ingredients', null, {});
    await queryInterface.bulkDelete('recipes', null, {});
  }
};
