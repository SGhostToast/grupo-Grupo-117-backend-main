const Router = require("koa-router");
const { Op } = require('sequelize');

const router = new Router();

router.post("players.create", "/invite", async(ctx) => {
  try {
    if (ctx.request.body.myusername && ctx.request.body.otherusername) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.myusername}});
      if (user) {
        const player = await ctx.orm.Player.findOne({where:{userid:user.id, status: 'READY'}});
        if (!player) {
          const invite = await ctx.orm.Player.findOne({where:{userid:user.id, status: 'PENDING'}});
          if (invite) {
            throw Error(`No eres parte de ninguna partida, pero te han invitado a al menos una. Acepta la invitación antes de invitar a más jugadores.`)
          }
          else {
            throw Error(`No eres parte de ninguna partida. Por favor, crea tu propia partida primero.`)
          }
        }
        const other = await ctx.orm.User.findOne({where:{username:ctx.request.body.otherusername}});
        if (!other) {
          throw Error(`No se encontró el usuario con username ${ctx.request.body.otherusername}.`)
        }
        else {
          const friend = await ctx.orm.Friend.findOne({
            where: {
              [Op.or]: [
                {frienderid: user.id, status: 'FRENS'},
                {befriendedid: user.id, status: 'FRENS'}
              ]
            }
          });
          if (!friend) {
            throw Error(`No eres amigx de ${ctx.request.body.otherusername}. ¡Puedes enviarle una solicitud de amistad para jugar juntos!`)
          }
          let otherplayer = await ctx.orm.Player.findOne({
            where: {
              [Op.and]: [
                {userid:other.id},
                {
                  [Op.or]: [
                    {status: 'READY'},
                    {status: 'PLAYING'},
                  ]
                }
              ]
            }
          });          
          if (otherplayer) {
            throw Error(`El usuario con username ${ctx.request.body.otherusername} ya se encuentra en otra partida.`)
          }
          const playerdata = {
            userid: other.id,
            gameid: player.gameid
          };
          otherplayer = await ctx.orm.Player.create(playerdata);
          ctx.body = {
            msg: `¡Has invitado a ${ctx.request.body.otherusername} a jugar en tu partida!`,
            new_player: otherplayer
          };
          ctx.status = 201;
        }
      }
      else {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.myusername}.`)
      }
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "myusername" y el de la otra persona como "otherusername".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.post("players.showinvitations", "/invitations", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const insidegame = await ctx.orm.Player.findOne({where:{userid:user.id, status: 'READY'}});
        if (insidegame) {
          const invited_to_your_game = await ctx.orm.Player.findAll({where:{gameid:insidegame.gameid, status: 'PENDING'}});
          ctx.body = {
            msg: `Amistades invitadas a tu juego actual:`,
            invited_to_your_game: invited_to_your_game
          };
          ctx.status = 201;
        }
        else {
          const you_were_invited_to = await ctx.orm.Player.findAll({where:{userid:user.id, status: 'PENDING'}});
          ctx.body = {
            msg: `Te invitaron a los siguientes juegos:`,
            you_were_invited_to: you_were_invited_to
          };
          ctx.status = 201;
        }
      }
      else {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.username}.`)
      }
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "username".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.post("players.accept", "/accept", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username && ctx.request.body.gameid) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const already_playing = await ctx.orm.Player.findOne({where:{userid:user.id, status:'PLAYING'}});
        if (already_playing) {
          throw Error(`Ya estás jugando el juego de id ${already_playing.gameid} que está en curso. No puedes jugar múltiples partidas a la vez.`);
        }
        const player = await ctx.orm.Player.findOne({where:{userid:user.id, gameid:ctx.request.body.gameid}});
        if (player) {
          if (player.status == 'WINNER' || player.status == 'LOSER') {
            throw Error(`Ya has participado del juego de id ${ctx.request.body.gameid}, y este ya terminó.`);
          }
          else if (player.status == 'READY') {
            throw Error(`Ya estás esperando a que el juego de id ${ctx.request.body.gameid} comience.`);
          }
          else {
            let all_players = await ctx.orm.Player.findAll({where:{gameid:ctx.request.body.gameid, status: 'READY'}});
            if (all_players.lenght == 4) {
              throw Error(`El juego de id ${ctx.request.body.gameid} llenó su máxima capacidad (4).`);
            }
            player.status = 'READY';
            player.save();
            ctx.body = {
              msg: `Has aceptado la invitación al juego de id ${ctx.request.body.gameid}. ¡Preparate!`,
              player: player
            };
          ctx.status = 201;
          }
        }
        else {
          throw Error(`No se encontró ningún juego de id ${ctx.request.body.gameid} al que puedas unirte.`);
        }
      }
      else {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.username}.`);
      }
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "username" y id del juego al cual quieres aceptar la invitación como "gameid".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.post("players.quit", "/quit", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username && ctx.request.body.gameid) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const player = await ctx.orm.Player.findOne({where:{userid:user.id, gameid:ctx.request.body.gameid}});
        if (player) {
          if (player.status == 'WINNER' || player.status == 'LOSER') {
            throw Error(`Ya has participado del juego de id ${ctx.request.body.gameid}, y este ya terminó.`);
          }
          else if (player.status == 'PLAYING') {
            throw Error(`Para rendirte en el juego de id ${ctx.request.body.gameid}, por favor hazlo a través de /ingame.`);
          }
          else if (player.status == 'READY') {
            await player.destroy();
            ctx.body = {
              msg: `Te has salido de la sala de espera juego de id ${ctx.request.body.gameid}. Necesitarás una nueva invitación para volver a entrar.`,
            };
          ctx.status = 201;
          }
          else {
            await player.destroy();
            ctx.body = {
              msg: `Has rechazado la invitación al juego de id ${ctx.request.body.gameid}.`,
            };
          ctx.status = 201;
          }
        }
        else {
          throw Error(`No se encontró ningún juego de id ${ctx.request.body.gameid} al que puedas unirte.`);
        }
      }
      else {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.username}.`);
      }
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "username" y id del juego involucrado como "gameid".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.post("players.begin", "/begin", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username && ctx.request.body.gameid) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const player = await ctx.orm.Player.findOne({where:{userid:user.id, gameid:ctx.request.body.gameid}});
        if (player) {
          if (player.status == 'WINNER' || player.status == 'LOSER') {
            throw Error(`Ya has participado del juego de id ${ctx.request.body.gameid}, y este ya terminó.`);
          }
          else if (player.status == 'PLAYING') {
            throw Error(`Ya estás jugando el juego de id ${ctx.request.body.gameid} que está en curso.`);
          }
          else if (player.status == 'PENDING') {
            throw Error(`Debes aceptar la invitación al juego de id ${ctx.request.body.gameid} para poder participar en él.`);
          }
          else {
            const game = await ctx.orm.Table.findOne({where:{id:player.gameid}});
            if (game.ownerid != player.id){
              throw Error(`No eres dueño del juego de id ${ctx.request.body.gameid}. Si quieres que comienze la partida, pidele al dueño que la comience.`);
            }
            let ordered_players = await ctx.orm.Player.findAll({where:{gameid:ctx.request.body.gameid, status: 'READY'}});
            if (ordered_players.lenght < 2) {
              throw Error(`Este juego es de 2 a 4 jugadores, ¡Invita a tus amistades para jugar!`);
            }
            let shuffled_players = [];
            while (ordered_players.lenght > 0) {
              const i = Math.floor(Math.random() * (ordered_players.lenght - 1));
              shuffled_players.push(ordered_players.splice(i, 1)[0]);
            }
            let i = 2;
            for (const plyer of shuffled_players) {
              plyer.status = 'PLAYING';
              plyer.insideid = i;
              plyer.save();
              i++;
            }
            createGameMaze(ctx, game.id, shuffled_players);
            ctx.body = {
              msg: `¡Ha comenzado el juego de id ${ctx.request.body.gameid}!`,
              players: shuffled_players
            };
            ctx.status = 201;
          }
        }
        else {
          throw Error(`No se encontró ningún juego de id ${ctx.request.body.gameid} al que puedas unirte.`);
        }
      }
      else {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.username}.`);
      }
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "username" y id del juego involucrado como "gameid".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.get("players.list", "/", async(ctx) => {
  try {
    const players = await ctx.orm.Player.findAll();
    ctx.body = players;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

router.get("players.show", "/:id", async(ctx) => {
  try {
    // const user = await ctx.orm.User.findByPk(ctx.params.id);
    const players = await ctx.orm.Player.findOne({where:{id:ctx.params.id}});
    ctx.body = players;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

router.get("players.show", "/meingame/:userid", async(ctx) => {
  try {
    // const user = await ctx.orm.User.findByPk(ctx.params.id);
    const player = await ctx.orm.Player.findOne({where:{userid:ctx.params.userid, status:'PLAYING'}});
    if (!player) {
      throw Error(`Tu usuario de id ${ctx.params.userid} no se encuentra en un juego en curso.`);
    }
    ctx.body = {
      msg: `Tu perfil de jugador en el juego actual es:`,
      top_card: player,
    };
    ctx.status = 200;
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

async function createGameMaze(ctx, gameid, players) {
  const cards = await ctx.orm.Cards.findAll();
  let maze = [];
  for (const card of cards) {
    const mazedata = {
      gameid: gameid,
      cardid: card.id,
    };
    if (card.symbol != '0') {
      const mazecarddouble = await ctx.orm.Maze.create(mazedata);
      maze.push(mazecarddouble);
    }
    const mazecard = await ctx.orm.Maze.create(mazedata);
    maze.push(mazecard);
  }

  let shuffled_maze = [];
  while (maze.lenght > 0) {
    const i = Math.floor(Math.random() * (maze.lenght - 1));
    shuffled_maze.push(maze.splice(i, 1)[0]);
  }

  for (const player of players) {
    for (let i = 0; i <= 6; i++) {
      const put_card = shuffled_maze.pop()
      put_card.holderid = player.insideid;
      put_card.order = i;
      put_card.save()
    }
  }

  for (let i = 0; i < shuffled_maze.lenght; i++) {
    if (i == (shuffled_maze.length - 1)) {
      // default holderid = 0 => Mazo para sacar.
      // holderid = 1 => Mazo descarte.
      shuffled_maze[i].order = 0;
      shuffled_maze[i].holderid = 1;
    }
    else {
      shuffled_maze[i].order = i;
    }
    shuffled_maze[i].save()
  }
}

module.exports = router;