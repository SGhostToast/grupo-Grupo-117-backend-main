'use strict';

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
    userid: {
      type: DataTypes.INTEGER,
      // https://www.npmjs.com/package/sequelize-noupdate-attributes
      noUpdate: true
    },
    gameid: {
      type: DataTypes.INTEGER,
      noUpdate: true
    },
    score: DataTypes.INTEGER,
    insideid: DataTypes.INTEGER,
    status: DataTypes.ENUM('PENDING', 'READY', 'PLAYING', 'WINNER', 'LOSER'),
    uno: DataTypes.ENUM('NO', 'VULNERABLE', 'SAFE')
  }, {
    // https://sequelize.org/docs/v6/other-topics/hooks/
    hooks: {
      afterCreate: (player) => {
        if (!player.name) {
          return sequelize.models.User.findByPk(player.userid)
            .then(user => {
              player.name = user.username;
              return player.save();
            });
        }
        return 1;
      },
      beforeUpdate: (player) => {
        if (player.previous('insideid')) {
          throw new Error('"insideid" ya ha sido inicializado y no permite modificación.');
        }
        else if (player.previous('status') == 'WINNER' || player.previous('status') == 'LOSER') {
          throw new Error('El "status" fue determinado al final del juego y no permite modificación.');
        }
      }
    },
    sequelize,
    modelName: 'Player',
  });
  return Player;
};