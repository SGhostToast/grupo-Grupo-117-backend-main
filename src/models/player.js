'use strict';

const User = require('./user');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userid'
      })
      this.belongsTo(models.Table, {
        foreignKey: 'gameid'
      })
    }
  }
  Player.init({
    name: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    gameid: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    insideid: DataTypes.INTEGER,
    status: DataTypes.ENUM('PENDING', 'READY', 'PLAYING', 'WINNER', 'LOSER')
  }, {
    // https://sequelize.org/docs/v6/other-topics/hooks/
    hooks: {
      afterCreate: (player) => {
        if (player.name == null) {
          return User.findByPk(player.userid)
            .then(user => {
              player.name = user.username;
              return player.save();
            });
        }
        return 1;
      }
    },
    sequelize,
    modelName: 'Player',
  });
  return Player;
};