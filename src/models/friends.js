'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {}
  Friend.init({
    frienderid: {
      type: DataTypes.INTEGER,
      validate: {
        isImmutable() {
          if (!this.isNewRecord) {
            throw new Error('El valor del atributo "frienderid" no puede ser modificado');
          }
        }
      }
    },
    befriendedid: {
      type: DataTypes.INTEGER,
      validate: {
        isImmutable() {
          if (!this.isNewRecord) {
            throw new Error('El valor del atributo "befriendedid" no puede ser modificado');
          }
        }
      }
    },
    status: DataTypes.ENUM('PENDING', 'FRENS')
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};