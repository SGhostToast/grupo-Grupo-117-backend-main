const koa = require("koa");
const koaLogger = require("koa-logger");
const { koaBody } = require("koa-body");
const router = require("./routes.js");
const orm = require("./models/index.js");

const { koaSwagger } = require("koa2-swagger-ui");
const yamljs = require("yamljs");

const app = new koa();

app.context.orm = orm;

app.use(koaLogger());
app.use(koaBody());

app.use(router.routes());

app.use((ctx) => {
    ctx.body = "Hola mundo!";
});

const spec = yamljs.load(__dirname + "/openapi.yml");

// example 1 using router.use()
router.use(koaSwagger({ swaggerOptions: { spec } }));

// example 2 using more explicit .get()
router.get("/test", (ctx, next) => {
  ctx.response.body = "Hello world!";
});

// example 2 using more explicit .get()
router.get(
  "/swagger",
  koaSwagger({ routePrefix: false, swaggerOptions: { spec } })
);

module.exports = app;
