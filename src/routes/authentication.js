const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const router = new Router();

router.post("authentication.signup", "/signup", async (ctx) => {
    const authInfo = ctx.request.body;
    let user = await ctx.orm.User.findOne({ where: { mail: authInfo.mail } })
    if (user) {
        ctx.body = `The user by the email '${authInfo.email}' already exists`;
        ctx.status = 400;
        return;
    }
    try {
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(authInfo.password, saltRounds);

        user = await ctx.orm.User.create({
            username: authInfo.username,
            password: hashPassword,
            mail: authInfo.email
        })
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    ctx.body = {
        username: user.username,
        email: user.mail
    };
    ctx.status = 201;
})

router.post("authentication.login", "/login", async (ctx) => {
    let user;
    const authInfo = ctx.request.body
    console.log(authInfo);
    try {
        user = await ctx.orm.User.findOne({where:{mail:authInfo.mail}});
        console.log(user);
    }
    catch(error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    if (!user) {
        ctx.body = `The user by the email '${authInfo.mail}' was not found`;
        ctx.status = 400;
        return;
    }

    if (await bcrypt.compare(authInfo.password, user.password)) {
        // Creamos el JWT. Si quisieras agregar distintos scopes, como por ejemplo
        // "admin", podrían hacer un llamado a la base de datos y cambiar el payload
        // en base a eso.
        const expirationSeconds = 1 * 60 * 60 * 24;
        const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
        var token = jwt.sign(
            { scope: ['user'] },
            JWT_PRIVATE_KEY,
            { subject: user.id.toString() },
            { expiresIn: expirationSeconds }
        );
        user.status = "ONLINE";
        user.save();
        ctx.body = {
            username: user.username,
            email: user.mail,
            access_token: token,
            token_type: "Bearer",
            expires_in: expirationSeconds,
        }
        ctx.status = 200;
    } else {
        ctx.body = "Incorrect password";
        ctx.status = 400;
        return;
    }
})

router.get("authentication.checkLogin", "/check-login", async (ctx) => {
    const token = ctx.request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        ctx.body = { isLoggedIn: false };
        ctx.status = 401;
        return;
    }

    try {
        const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);

        ctx.body = { isLoggedIn: true };
        ctx.status = 200;
    }
    catch (error) {
        ctx.body = { isLoggedIn: false };
        ctx.status = 401;
    }
});
  

module.exports = router;