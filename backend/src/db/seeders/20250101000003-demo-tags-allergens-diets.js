'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tags
    await queryInterface.bulkInsert('tags', [
      { name: 'Desayuno' },
      { name: 'Almuerzo' },
      { name: 'Cena' },
      { name: 'Postre' },
      { name: 'Snack' },
      { name: 'Rápido' },
      { name: 'Saludable' },
      { name: 'Comfort food' },
      { name: 'Festivo' },
      { name: 'Para niños' }
    ], {
      updateOnDuplicate: ['name']
    });

    // Allergens
    await queryInterface.bulkInsert('allergens', [
      { name: 'Gluten' },
      { name: 'Lácteos' },
      { name: 'Huevo' },
      { name: 'Frutos secos' },
      { name: 'Mariscos' },
      { name: 'Soja' },
      { name: 'Pescado' }
    ], {
      updateOnDuplicate: ['name']
    });

    // Diets
    await queryInterface.bulkInsert('diets', [
      { name: 'Vegetariana' },
      { name: 'Vegana' },
      { name: 'Sin gluten' },
      { name: 'Baja en carbohidratos' },
      { name: 'Keto' },
      { name: 'Paleo' },
      { name: 'Sin lácteos' }
    ], {
      updateOnDuplicate: ['name']
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tags', null, {});
    await queryInterface.bulkDelete('allergens', null, {});
    await queryInterface.bulkDelete('diets', null, {});
  }
};
