'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {}
  Friend.init({
    frienderid: {
      type: DataTypes.INTEGER,
      noUpdate: true
    },
    befriendedid: {
      type: DataTypes.INTEGER,
      noUpdate: true
    },
    status: DataTypes.ENUM('PENDING', 'FRENS')
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};