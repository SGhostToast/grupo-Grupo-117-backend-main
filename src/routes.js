const Router = require("koa-router");
const users = require("./routes/users.js");
const tables = require("./routes/tables.js");
const players = require("./routes/players.js");
const ingame = require("./routes/ingame.js");
const cards = require("./routes/cards.js")
const auth = require("./routes/authentication.js")
const dotenv = require('dotenv');
const jwtMiddleware = require('koa-jwt')

dotenv.config();

const router = new Router();

router.use('/auth', auth.routes());
router.use('/cards', cards.routes());

// Desde esta línea, todas las rutas requieriran un JWT. Esto no aplica para
// las líneas anteriores
router.use(jwtMiddleware( { secret: process.env.JWT_SECRET } ))

router.use('/users', users.routes());
router.use('/tables', tables.routes());
router.use('/players', players.routes());
router.use('/ingame', ingame.routes());


module.exports = router;
