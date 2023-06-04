'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maze extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Table, {
        foreignKey: 'gameid'
      })
      this.belongsTo(models.Card, {
        foreignKey: 'cardid'
      })
    }
  }
  Maze.init({
    gameid: {
      type: DataTypes.INTEGER,
      validate: {
        isImmutable() {
          throw new Error('El valor del atributo "gameid" no puede ser modificado');
        }
      }
    },
    cardid: {
      type: DataTypes.INTEGER,
      validate: {
        isImmutable() {
          throw new Error('El valor del atributo "cardid" no puede ser modificado');
        }
      }
    },
    holderid: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Maze',
  });
  return Maze;
};