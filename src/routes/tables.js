const Router = require("koa-router");

const router = new Router();

router.post("tables.create", "/create", async(ctx) => {
  // console.log("creating game")
  // console.log(ctx.request)
  try {
    console.log("--- in the try")
    if (ctx.request.body.username) {
      console.log("--- in the if")
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        console.log("--- user exists")
        const table = await ctx.orm.Table.create({
          ownerid: user.id,
          color:'RED'
        });
        console.log("--- table created")
        let playerdata = {
          userid: user.id,
          gameid: table.id,
          status: 'READY'
        };
        if (ctx.request.body.gamename) {
          playerdata.name = ctx.request.body.gamename
        }
        console.log('--- creating player');
        const player = await ctx.orm.Player.create(playerdata);
        console.log('--- player created');
        ctx.body = {
          msg: `Partida creada por jugador ${player.name}. ¡Invita a tus amistades a jugar!`,
          table: table,
          player: player
        };
        ctx.status = 201;
      }
      else {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.username}.`)
      }
    }
    else {
      throw Error('Se necesita entregar al menos tu nombre de usuario como "username" y opcional un nombre de jugador como "gamename".')
    }
  } catch(error) {
    console.log("in the error")
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.get("tables.list", "/", async(ctx) => {
  try {
    const tables = await ctx.orm.Table.findAll();
    ctx.body = tables;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

router.get("tables.show", "/:id", async(ctx) => {
  try {
    // const user = await ctx.orm.User.findByPk(ctx.params.id);
    const tables = await ctx.orm.Tables.findOne({where:{id:ctx.params.id}});
    ctx.body = tables;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

router.get("tables.players", "/:id/players", async(ctx) => {
  try {
    const players = await ctx.orm.Players.findAll({where:{gameid:ctx.params.id}});
    ctx.body = players;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

module.exports = router;