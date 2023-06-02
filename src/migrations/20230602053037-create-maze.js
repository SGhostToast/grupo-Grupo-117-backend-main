'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mazes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameid: {
        type: Sequelize.INTEGER,
        references: { model: 'Tables', key: 'id'}
      },
      cardid: {
        type: Sequelize.INTEGER,
        references: { model: 'Cards', key: 'id'}
      },
      holderid: {
        type: Sequelize.INTEGER
      },
      order: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Mazes');
  }
};