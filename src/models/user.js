'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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
      // https://stackoverflow.com/questions/61965582/sequelize-many-to-many-relationship-same-table
      this.belongsToMany(models.User, {
        through: 'Friends',
        as: 'friender',
        foreignKey: 'id'
      });
      this.belongsToMany(models.User, {
        through: 'Friends',
        as: 'befriended',
        foreignKey: 'id'
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    mail: DataTypes.STRING,
    played_matches: DataTypes.INTEGER,
    won_matches: DataTypes.INTEGER,
    max_score: DataTypes.INTEGER,
    total_score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};