const Router = require("koa-router");
const characters = require("./routes/characters.js");
const users = require("./routes/users.js");

const router = new Router();

// la ruta por los endpoint de characters.js sera /characters
// la ruta del show : /characters/show
router.use('/characters', characters.routes());
router.use('/users', users.routes());

module.exports = router;
