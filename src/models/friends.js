'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {}
  Friend.init({
    frienderid: DataTypes.INTEGER,
    befriendedid: DataTypes.INTEGER,
    status: DataTypes.ENUM('PENDING', 'FRENS')
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};