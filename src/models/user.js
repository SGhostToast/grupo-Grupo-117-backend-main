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
    username: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[a-zA-Z0-9._\-!¡?¿$&@]+$/,
          msg: 'Nombre de usuario inválido. Puedes usar caracteres alfanuméricos y los símbolos ._-!¡?¿$&@'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        isValidPassword(value) {
          if ((!value.match(/[a-z]/)) || (!value.match(/[0-9]/)) || (!value.match(/[._\-!¡?¿$&@]/))) {
            throw new Error('La clave debe tener al menos una letra, un número y un caracter especial ._-!¡?¿$&@')
          }
        },
      },
    },
    mail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Formato de e-mail incorrecto.'
        },
      },
    },
    played_matches: DataTypes.INTEGER,
    won_matches: DataTypes.INTEGER,
    max_score: DataTypes.INTEGER,
    total_score: DataTypes.INTEGER,
    status: DataTypes.ENUM('OFFLINE', 'ONLINE', 'PLAYING')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};