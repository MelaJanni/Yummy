'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cuisine: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'medium'
      },
      minutes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      servings: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      thumbnailUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected'),
        defaultValue: 'draft',
        allowNull: false
      },
      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('recipes', ['slug'], { unique: true });
    await queryInterface.addIndex('recipes', ['status']);
    await queryInterface.addIndex('recipes', ['authorId']);
    await queryInterface.addIndex('recipes', ['cuisine']);
    await queryInterface.addIndex('recipes', ['difficulty']);
    await queryInterface.addIndex('recipes', ['minutes']);
    await queryInterface.addIndex('recipes', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('recipes');
  }
};
