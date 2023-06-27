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
      noUpdate: true
    },
    cardid: {
      type: DataTypes.INTEGER,
      noUpdate: true
    },
    holderid: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Maze',
  });
  return Maze;
};