const Router = require("koa-router");

const router = new Router();

router.post("game.takecard", "/take", async(ctx) => {
  try {
    if (ctx.request.body.playerid) {
      const player = await ctx.orm.Player.findOne({where:{id:ctx.params.playerid}});
      if (player) {
        // Mazes get created when a game starts and get destroyed when it ends, so the abscence of a maze indicates the game is not being played
        const grab_card = await ctx.orm.Maze.findOne({
          where: {gameid:player.gameid, holderid:0}, // holderid = 0 => Pickup maze.
          order: [['order', 'DESC']],
        });
        if (!grab_card) {
          throw Error(`El juego del perfil de jugador de id ${ctx.params.playerid} no está en curso.`);
        }
        const table = await ctx.orm.Table.findOne({where:{id:player.gameid, turn:player.insideid}});
        if (!table) {
          throw Error(`Solo puedes sacar cartas del maso común cuando sea tu turno.`);
        }
        const top_hand_card = await ctx.orm.Maze.findOne({
          where: {gameid:player.gameid, holderid:player.insideid},
          order: [['order', 'DESC']],
        });
        grab_card.holderid = player.insideid;
        grab_card.order = (top_hand_card.order + 1);
        grab_card.save()
        const card = await ctx.orm.Card.findOne({where:{id:grab_card.cardid}});
        ctx.body = {
          msg: `Has tomado la carta de id ${grab_card.id} del mazo común.`,
          card: grab_card,
          description: card
        };
        ctx.status = 201;
      }
      else {
        throw Error(`No se ha encontrado un jugador con id ${ctx.params.playerid}`);
      }
    }
    else {
      throw Error('Se necesita tu id jugador para esta partida como "playerid".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.get("game.lookatdisplayedcard", "/card/:tableid", async(ctx) => {
  try {
    // Mazes get created when a game starts and get destroyed when it ends, so the abscence of a maze indicates the game is not being played
    const card = await ctx.orm.Maze.findOne({
      where: {gameid:ctx.params.tableid, holderid:1}, // holderid = 1 => Put down maze.
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

router.get("game.turn", "/turn/:tableid", async(ctx) => {
  try {
    // Mazes get created when a game starts and get destroyed when it ends, so the abscence of a maze indicates the game is not being played
    const card = await ctx.orm.Maze.findOne({where: {gameid:ctx.params.tableid}});
    if (!card) {
      throw Error(`No se ha encontrado un juego en curso con id ${ctx.params.tableid}`);
    }
    const table = await ctx.orm.Table.findOne({where:{id:ctx.params.tableid}});
    const player = await ctx.orm.Table.findOne({where:{gameid:ctx.params.tableid, insideid:table.turn}});
    ctx.body = {
      msg: `Es el turno de:`,
      turn: player,
    };
    ctx.status = 200;
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.get("game.lookathand", "/hand/:playerid", async(ctx) => {
  try {
    const player = await ctx.orm.Player.findOne({where:{id:ctx.params.playerid}});
    if (!player) {
      throw Error(`No se ha encontrado un jugador con id ${ctx.params.playerid}`);
    }
    // Mazes get created when a game starts and get destroyed when it ends, so the abscence of a maze indicates the game is not being played
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