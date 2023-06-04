const Router = require("koa-router");

const router = new Router();

router.post("tables.create", "/create", async(ctx) => {
  try {
    if (ctx.request.body.username) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const table = await ctx.orm.Table.create({});
        let playerdata = {
          userid: user.id,
          gameid: table.id,
          status: 'READY'
        };
        if (ctx.request.body.gamename) {
          playerdata.name = ctx.request.body.gamename
        }
        const player = await ctx.orm.Player.create(playerdata);
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
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.get("game.lookatdisplayedcard", "/:tableid", async(ctx) => {
  try {
    const card = await ctx.orm.Maze.findOne({
      where: {gameid: ctx.params.tableid, holderid: 1}, // holderid = 1 => Mazo descarte.
      order: [['order', 'DESC']],
    });
    if (!card) {
      throw Error(`No se ha encontrado un juego en curso con id ${ctx.params.tableid}`);
    }
    ctx.body = {
      msg: `Carta boca arriba en la mesa:`,
      top_card: card,
    };
    ctx.status = 200;
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.get("game.lookathand", "/:playerid", async(ctx) => {
  try {
    const player = await ctx.orm.Player.findOne({where:{id:ctx.params.playerid}});
    if (!player) {
      throw Error(`No se ha encontrado un jugador con id ${ctx.params.playerid}`);
    }
    const hand = await ctx.orm.Maze.findAll({where:{gameid:player.gameid, holderid:player.insideid}});
    if (!hand) {
      throw Error(`El jugador ${ctx.params.playerid} no se encuentra jugando una partida.`);
    }
    ctx.body = {
      msg: `Mano de jugador de id ${ctx.params.playerid}`,
      hand: hand,
    };
    ctx.status = 200;
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

module.exports = router;