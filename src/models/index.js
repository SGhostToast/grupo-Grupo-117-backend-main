'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
import config from '../config/config.js';
const configData = config[env];
const db = {};

let sequelize;
if (configData.use_env_variable) {
  sequelize = new Sequelize(process.env[configData.use_env_variable], configData);
} else {
  sequelize = new Sequelize(configData.database, configData.username, configData.password, configData);
}

async function importModel(file) {
  const module = await import(path.join(__dirname, file));
  const model = module.default(sequelize, Sequelize.DataTypes);
  return model;
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(async file => {
    const model = await importModel(file);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// module.exports = db;

export default db;