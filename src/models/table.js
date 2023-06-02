'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Player, {
        foreignKey: 'id'
      })
      this.hasMany(models.Maze, {
        foreignKey: 'id'
      })
    }
  }
  Table.init({
    clockwise: DataTypes.BOOLEAN,
    turns: DataTypes.INTEGER,
    insideid: DataTypes.INTEGER,
    winner: DataTypes.STRING,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Table',
  });
  return Table;
};