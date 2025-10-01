'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ingredients', [
      { name: 'Harina 0000' },
      { name: 'Azúcar' },
      { name: 'Huevos' },
      { name: 'Leche' },
      { name: 'Manteca' },
      { name: 'Sal fina' },
      { name: 'Aceite de oliva' },
      { name: 'Tomate' },
      { name: 'Cebolla' },
      { name: 'Ajo' },
      { name: 'Fideos' },
      { name: 'Arroz' },
      { name: 'Pollo' },
      { name: 'Carne picada' },
      { name: 'Queso rallado' },
      { name: 'Yogur natural' },
      { name: 'Papa' },
      { name: 'Zanahoria' },
      { name: 'Espinaca' },
      { name: 'Brócoli' }
    ], {
      updateOnDuplicate: ['name']
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ingredients', null, {});
  }
};
