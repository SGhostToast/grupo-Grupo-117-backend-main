const process = require('process');
const app = require('./app.js');
const db = require('./models/index.js');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;


let cleanup = false;

// Handle Ctrl+C interruption signal
const cleanupHandler = async () => {
    if (cleanup) {
        console.log('\nStill cleaning');
        return;
    }

    cleanup = true;

    try {
        console.log('\nInterrupted, starting cleanup.');
        await db.User.update({ status: 'OFFLINE' }, { where: {} });
        console.log('Cleanup completed successfully');
        process.exit();
    } catch (err) {
        console.error('\nError during cleanup:', err);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await cleanupHandler();
});

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
