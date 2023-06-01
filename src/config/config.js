import dotenv from 'dotenv';

// para utilizar las variables de .env aqui
dotenv.config();

const module_exports =  {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": `${process.env.DB_NAME}_development`,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": `${process.env.DB_NAME}_test`,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": `${process.env.DB_NAME}_production`,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  }
}

// {
//   "development": {
//     "username": process.env.DB_USERNAME,
//     "password": process.env.DB_PASSWORD,
//     "database": String(process.env.DB_NAME) + "_development",
//     "host": process.env.DB_HOST,
//     "dialect": "postgres"
//   },
//   "test": {
//     "username": process.env.DB_USERNAME,
//     "password": process.env.DB_PASSWORD,
//     "database": String(process.env.DB_NAME) + "_test",
//     "host": process.env.DB_HOST,
//     "dialect": "postgres"
//   },
//   "production": {
//     "username": process.env.DB_USERNAME,
//     "password": process.env.DB_PASSWORD,
//     "database": String(process.env.DB_NAME) + "_production",
//     "host": process.env.DB_HOST,
//     "dialect": "postgres"
//   }
// }


export default module_exports;