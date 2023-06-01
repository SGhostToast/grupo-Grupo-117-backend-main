import koa from "koa";
import koaLogger from "koa-logger";
import {koaBody} from "koa-body";
import router from "./routes.js";

const app = new koa();

// Middleware proporcionados por Koa
app.use(koaLogger());
app.use(koaBody());

// koa-router
app.use(router.routes()); // solo se ocupa recuperar las rutas de routes.js


app.use((ctx, next) => {
    ctx.body = "Hola mundo !";
})

let puerto = 3000;
app.listen(puerto, () => {
    console.log("Iniciando app en puerto " + String(puerto));
});