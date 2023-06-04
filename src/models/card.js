'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Maze, {
        foreignKey: 'id'
      })
    }
  }
  Card.init({
    color: {
      type: DataTypes.STRING,
      validate: {
        isImmutable() {
          throw new Error('El valor del atributo "color" no puede ser modificado');
        }
      }
    },
    symbol: {
      type: DataTypes.STRING,
      validate: {
        isImmutable() {
          throw new Error('El valor del atributo "symbol" no puede ser modificado');
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};