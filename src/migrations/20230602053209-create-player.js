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
        type: Sequelize.STRING,
        defaultValue: null
      },
      userid: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id'},
        allowNull: false
      },
      gameid: {
        type: Sequelize.INTEGER,
        references: { model: 'Tables', key: 'id'},
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      insideid: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'READY', 'PLAYING', 'WINNER', 'LOSER'),
        allowNull: false,
        defaultValue: 'PENDING'
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