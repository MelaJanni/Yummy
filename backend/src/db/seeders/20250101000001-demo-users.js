'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
    const hashedUserPassword = await bcrypt.hash('User123!', 10);
    const now = new Date();

    const users = [
      {
        name: 'Admin Demo',
        email: 'admin@demo.com',
        passwordHash: hashedAdminPassword,
        role: 'admin',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'User Demo',
        email: 'user@demo.com',
        passwordHash: hashedUserPassword,
        role: 'user',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Maria Garcia',
        email: 'maria@demo.com',
        passwordHash: hashedUserPassword,
        role: 'user',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('users', users, {
      updateOnDuplicate: ['name', 'passwordHash', 'role', 'isVerified', 'updatedAt']
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
