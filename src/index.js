const process = require('process');
const app = require('./app.js');
const db = require('./models/index.js');
const dotenv = require('dotenv');

dotenv.config();

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
