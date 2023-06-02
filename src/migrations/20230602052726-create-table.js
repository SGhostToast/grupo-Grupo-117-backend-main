'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clockwise: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      turns: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // insideid: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 0
      // },
      winner: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: new Date()
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
    await queryInterface.dropTable('Tables');
  }
};