import app from './app.js';
import db from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

/* global process */

const PORT = process.env.PORT || 3000;

db.sequelize
    .authenticate()
    .then(() => {
        console.log("Connection to the database has been established successfully.");
        app.listen(PORT, (err) => {
            if (err) {
                return console.log('Failed', err);
            }
            console.log("Listening on port " + String(PORT));
            return app;
        });
    })
    .catch((err) => console.log("Unable to connect to the database: ", err));