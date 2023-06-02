const Router = require("koa-router");

const router = new Router();

router.post("users.create", "/signup", async(ctx) => {
  try {
    const user = await ctx.orm.User.create(ctx.request.body);
    ctx.body = user;
    ctx.status = 201;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

router.post("users.enter", "/login", async(ctx) => {
  try {
    let user;
    if(ctx.request.body.username && ctx.request.body.password) {
      user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username, password:ctx.request.body.password}});
    }
    else if(ctx.request.body.mail && ctx.request.body.password) {
      user = await ctx.orm.User.findOne({where:{mail:ctx.request.body.mail, password:ctx.request.body.password}});
    }
    else {
      throw Error('Se necesita entregar un "username" o "mail" con su "password" correspondiente.')
    }
    if (user && user.status == 'OFFLINE') {
      user.status = 'ONLINE';
      await user.save();
      ctx.body = {
        msg: 'Login exitoso.',
        user: user
      };
    }
    else if (user) {
      ctx.body = {
        msg: 'Este usuario ya se encuentra ingresado en otra parte.',
        user: user
      };
    }
    else {
      ctx.body = {
        msg: 'Los datos no calzan con un usuario existente, intenta denuevo.',
        user: user
      };
    }
    ctx.status = 200;
  } catch(error) {
    ctx.body = { errorMessage: error.message, errorCode: error.code };
    ctx.status = 400;
  }
})

router.get("users.list", "/", async(ctx) => {
  try {
    const users = await ctx.orm.User.findAll();
    ctx.body = users;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

router.get("users.show", "/:id", async(ctx) => {
  try {
    // const user = await ctx.orm.User.findByPk(ctx.params.id);
    const user = await ctx.orm.User.findOne({where:{id:ctx.params.id}});
    ctx.body = user;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

module.exports = router;