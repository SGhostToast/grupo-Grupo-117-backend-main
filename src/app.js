const koa = require("koa");
const koaLogger = require("koa-logger");
const { koaBody } = require("koa-body");
const router = require("./routes.js");
const orm = require("./models/index.js");

const app = new koa();

app.context.orm = orm;

app.use(koaLogger());
app.use(koaBody());

app.use(router.routes());

app.use((ctx) => {
    ctx.body = "Hola mundo!";
});

module.exports = app;
