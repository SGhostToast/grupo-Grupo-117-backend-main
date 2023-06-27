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
      type: DataTypes.ENUM('RED', 'YELLOW', 'BLUE', 'GREEN', 'MULTI'),
      noUpdate: true
    },
    symbol: {
      type: DataTypes.ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'drawTwo', 'reverse', 'skip', 'wild', 'wildDraw4'),
      noUpdate: true
    }
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};