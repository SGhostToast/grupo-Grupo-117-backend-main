'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      mail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      played_matches: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      won_matches: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      max_score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // async down(queryInterface, Sequelize) {
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};