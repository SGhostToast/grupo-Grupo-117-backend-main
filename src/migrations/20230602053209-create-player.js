'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      userid: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id'}
      },
      gameid: {
        type: Sequelize.INTEGER,
        references: { model: 'Tables', key: 'id'}
      },
      score: {
        type: Sequelize.INTEGER
      },
      insideid: {
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
    await queryInterface.dropTable('Players');
  }
};