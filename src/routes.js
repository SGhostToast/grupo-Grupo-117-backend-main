const Router = require("koa-router");
const users = require("./routes/users.js");
const tables = require("./routes/tables.js");
const players = require("./routes/players.js");
const ingame = require("./routes/ingame.js");
const cards = require("./routes/cards.jsx")

const router = new Router();

router.use('/users', users.routes());
router.use('/tables', tables.routes());
router.use('/players', players.routes());
router.use('/ingame', ingame.routes());
router.use('/cards', cards.routes());

module.exports = router;
