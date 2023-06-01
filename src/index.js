import koa from "koa";
import koaLogger from "koa-logger";
import {koaBody} from "koa-body";

const app = new koa();

app.use(koaLogger());
app.use(koaBody());

app.use((ctx, next) => {
    ctx.body = "Hola mundo !";
})

let puerto = 3000;
app.listen(puerto, () => {
    console.log("Iniciando app en puerto " + String(puerto));
});