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
        references: { model: 'Tables', key: 'id'},
        allowNull: false
      },
      cardid: {
        type: Sequelize.INTEGER,
        references: { model: 'Cards', key: 'id'},
        allowNull: false
      },
      holderid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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