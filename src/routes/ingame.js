const Router = require("koa-router");

const router = new Router();

router.post("game.takecard", "/take", async(ctx) => {
  try {
    if (ctx.request.body.playerid) {
      const player = await ctx.orm.Player.findOne({where:{id:ctx.request.body.playerid}});
      if (player) {
        // Mazes get created when a game starts and get destroyed when it ends, so the abscence of a maze indicates the game is not being played
        const grab_card = await ctx.orm.Maze.findOne({
          where: {gameid:player.gameid, holderid:0}, // holderid = 0 => Pickup maze.
          order: [['order', 'DESC']],
        });
        if (!grab_card) {
          throw Error(`El juego del perfil de jugador de id ${ctx.request.body.playerid} no está en curso.`);
        }
        const table = await ctx.orm.Table.findOne({where:{id:player.gameid, turn:player.insideid}});
        if (!table) {
          throw Error(`Solo puedes sacar cartas del maso común cuando sea tu turno.`);
        }
        drawCard(ctx, player, grab_card);
        const card = await ctx.orm.Card.findOne({where:{id:grab_card.cardid}});
        ctx.body = {
          msg: `Has tomado la carta de id ${grab_card.id} del mazo común.`,
          card: grab_card,
          description: card
        };
        ctx.status = 201;
      }
      else {
        throw Error(`No se ha encontrado un jugador con id ${ctx.request.body.playerid}`);
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

router.post("game.playcard", "/play", async(ctx) => {
  try {
    if (ctx.request.body.playerid && ctx.request.body.cardorder) {
      const player = await ctx.orm.Player.findOne({where:{id:ctx.params.playerid}});
      if (player) {
        if (player.status != 'PLAYING') {
          throw Error(`El juego del perfil de jugador de id ${ctx.params.playerid} no está en curso.`);
        }
        const table = await ctx.orm.Table.findOne({where:{id:player.gameid, turn:player.insideid}});
        if (!table) {
          throw Error(`Solo puedes hacer una jugada cuando sea tu turno.`);
        }
        const play_card = await ctx.orm.Maze.findOne({where: {gameid:player.gameid, holderid:player.insideid, order:ctx.request.body.cardorder}});
        if (!play_card) {
          throw Error(`El orden ${ctx.request.body.cardorder} está fuera del rango de tu mano.`);
        }
        const top_card = await ctx.orm.Maze.findOne({
          where: {gameid:ctx.params.tableid, holderid:1}, // holderid = 1 => Put down maze.
          order: [['order', 'DESC']],
        });
        const top_card_type = await ctx.orm.card.findOne({where: {id:top_card.cardid}});
        const card_type = await ctx.orm.card.findOne({where: {id:play_card.cardid}});
        let wild = false;
        if (card_type.symbol == 'wild' || card_type.symbol == 'wildDraw4') {
          wild = true;
        }
        else if (card_type.symbol != top_card_type.symbol && card_type.color != table.color) {
          if (card_type.color != table.color) {
            throw Error(`No puedes jugar tu carta de orden ${ctx.request.body.cardorder} en tu mano ya que esta es de color 
                        ${card_type.color} y el color permitido es ${table.color}`);
          }
          else {
            throw Error(`No puedes jugar tu carta de orden ${ctx.request.body.cardorder} en tu mano ya que esta tiene el símbolo 
                        ${card_type.symbol} y la carta jugada anteriormente tiene el símbolo ${top_card_type.symbol}`);
          }
        }
        const all_players = await ctx.orm.Player.findAll({where:{gameid: player.gameid}});
        let play_type;
        if (wild) {
          if (!ctx.request.body.color) {
            throw Error('Se necesita el color al que quieras cambiar como "color" al jugar una carta "wild" o "wildDraw4".')
          }
          play_type = await playCard(ctx, player, table, all_players, ctx.request.body.cardorder, ctx.request.body.color);
        }
        else {
          play_type = await playCard(ctx, player, table, all_players, ctx.request.body.cardorder, null);
        }
        let body;
        if (play_type == 'standard') {
          body = {
          msg: `Has jugado la carta de orden ${ctx.request.body.cardorder} en tu mano.`,
          card: play_card,
          description: card_type
          };
        }
        else {
          body = {
          msg: `¡Has jugado la carta de orden ${ctx.request.body.cardorder} en tu mano y has ganado el juego! Felicitaciónes.`,
          card: play_card,
          description: card_type,
          table: table
          };
        }
        ctx.body = body;
        ctx.status = 201;
      }
      else {
        throw Error(`No se ha encontrado un jugador con id ${ctx.params.playerid}`);
      }
    }
    else {
      throw Error('Se necesita como mínimo tu id jugador para esta partida como "playerid" y la posición en tu mano de la carta que quieres jugar como "cardorder",'+ 
                  'y, si es el caso, el color al que quieras cambiar como "color" al jugar una carta "wild" o "wildDraw4".')
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
    const player = await ctx.orm.Player.findOne({where:{gameid:ctx.params.tableid, insideid:table.turn}});
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
    const hand = await ctx.orm.Maze.findAll({
      where: {gameid:player.gameid, holderid:player.insideid},
      order: [['order', 'DESC']],
    });
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

async function playCard(ctx, player, table, all_players, card, card_type, color) {
  const cardorder = card.order;
  const hand = await ctx.orm.Maze.findAll({
    where: {gameid:player.gameid, holderid:player.insideid},
    order: [['order', 'DESC']],
  });
  const top_on_desk = await ctx.orm.Maze.findOne({
    where: {gameid:player.gameid, holderid:0},
    order: [['order', 'DESC']],
  });

  // Take out card, put it on game
  const playable_card = hand.splice(cardorder, 1);
  playable_card.holderid = 0;
  playable_card.order = (top_on_desk.order + 1);
  playable_card.save();

  // Reorder hand without old card
  for (let i = 0; i < hand.length; i++) {
    hand[i].order = i;
    hand[i].save();
  }

  table.color = card_type.color;
  table.save();

  return await finishTurn(ctx, player, table, all_players, card_type.symbol, color);
}

async function finishTurn(ctx, player, table, all_players, effect, color) {
  const hand = await ctx.orm.Maze.findAll({
    where: {gameid:player.gameid, holderid:player.insideid},
    order: [['order', 'DESC']],
  });
  let player_aux_turn = player.insideid;
  if (hand.length == 0) {
    return finishGame(ctx, player, all_players);
  }
  if (effect == 'wild') {
    wild(table, color);
  }
  else if (effect == 'wildDraw4') {
    wildDraw4(ctx, table, player_aux_turn, all_players, color);
  }
  else if (effect == 'drawTwo') {
    drawTwo(ctx, table, player_aux_turn, all_players);
  }
  else if (effect == 'reverse') {
    reverse(table);
  }
  else if (effect == 'skip') {
    player_aux_turn = await getNext(table, player_aux_turn, all_players);
  }
   table.turn = await getNext(table, player_aux_turn, all_players);
   table.save()
return 'standard';
}

async function finishGame(ctx, player, all_players) {
  player.status = 'WINNER';
  player.save();
  for (const loser of all_players) {
    if (loser.id == player.id) {
      continue
    }
    loser.status = 'LOSER';
    loser.save();
  }

  await ctx.orm.Maze.destroy({where:{gameid: player.gameid}});

  return 'ended';
}

async function wild(table, color) {
  table.color = color;
  table.save();
}

async function wildDraw4(ctx, table, player_aux_turn, all_players, color) {
  await wild(table, color);
  await drawTwo(ctx, table, player_aux_turn, all_players);
  await drawTwo(ctx, table, player_aux_turn, all_players);
}

async function drawTwo(ctx, table, player_aux_turn, all_players) {
  const nextturnid = await getNext(table, player_aux_turn, all_players);
  const nextplayer = await ctx.orm.Player.findOne({where: {gameid:all_players[0].gameid, insideid:nextturnid}});
  let grab_card = await ctx.orm.Maze.findOne({
    where: {gameid:all_players[0].gameid, holderid:0}, // holderid = 0 => Pickup maze.
    order: [['order', 'DESC']],
  });
  drawCard(ctx, nextplayer, grab_card);
  grab_card = await ctx.orm.Maze.findOne({
    where: {gameid:all_players[0].gameid, holderid:0}, // holderid = 0 => Pickup maze.
    order: [['order', 'DESC']],
  });
  drawCard(ctx, nextplayer, grab_card);
}

async function reverse(table) {
  table.clockwise = (!table.clockwise);
  table.save();
}

async function getNext(table,player_aux_turn, all_players) {
  if (table.clockwise) {
    if (player_aux_turn == (all_players.length + 2)){
      return 2;
    }
    else {
      return (player_aux_turn + 1);
    }
  }
  else {
    if (player_aux_turn == 2){
      return (all_players.length + 2);
    }
    else {
      return (player_aux_turn - 1);
    }
  }
}

async function drawCard(ctx, player, grab_card){
  const top_hand_card = await ctx.orm.Maze.findOne({
    where: {gameid:player.gameid, holderid:player.insideid},
    order: [['order', 'DESC']],
  });
  grab_card.holderid = player.insideid;
  grab_card.order = (top_hand_card.order + 1);
  grab_card.save()
}

module.exports = router;