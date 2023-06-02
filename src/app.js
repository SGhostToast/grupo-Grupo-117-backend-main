import koa from "koa";
import koaLogger from "koa-logger";
import {koaBody} from "koa-body";
import router from "./routes.js";
import orm from "./models/index.js";

const app = new koa();

app.context.orm = orm; // para acceder al orm desde cualquier lugar

// Middleware proporcionados por Koa
app.use(koaLogger());
app.use(koaBody());

// koa-router
app.use(router.routes()); // solo se ocupa recuperar las rutas de routes.js


// cualquier request recibe esta funcion
app.use((ctx) => {
    ctx.body = "Hola mundo !";
})

// Ya escuchamos en index.js
// let puerto = 3000;
// app.listen(puerto, () => {
//     console.log("Iniciando app al puerto " + puerto);
// })

export default app;