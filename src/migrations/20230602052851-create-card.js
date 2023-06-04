'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      color: {
        type: Sequelize.ENUM('RED', 'YELLOW', 'BLUE', 'GREEN', 'MULTI')
      },
      symbol: {
        type: Sequelize.ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'drawTwo', 'reverse', 'skip', 'wild', 'wildDraw4')
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
    await queryInterface.dropTable('Cards');
  }
};