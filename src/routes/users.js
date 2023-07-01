const Router = require("koa-router");
const { Op } = require('sequelize');

const router = new Router();

// ********** POSTS **********

// ---------- Friends ----------

router.post("users.showfriends", "/showfriends", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const friends = await ctx.orm.Friend.findAll({
          where: {
            [Op.or]: [
              {frienderid: user.id, status: 'FRENS'},
              {befriendedid: user.id, status: 'FRENS'}
            ]
          }
        });
        ctx.body = {
          msg: `Lista de amistades.`,
          friends: friends
        };
        ctx.status = 201;
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

router.post("users.pendingfriends", "/pendingfriends", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const pending_invites = await ctx.orm.Friend.findAll({where:{befriendedid:user.id, status:'PENDING'}});
        ctx.body = {
          msg: `Lista de amistades por aceptar/rechazar encontrada.`,
          pending_invites: pending_invites
        };
        ctx.status = 201;
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

router.post("users.pendingrequests", "/pendingrequests", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.username) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.username}});
      if (user) {
        const pending_requests = await ctx.orm.Friend.findAll({where:{frienderid:user.id, status:'PENDING'}});
        ctx.body = {
          msg: `Lista de solicitudes amistades pendientes enviadas.`,
          pending_requests: pending_requests
        };
        ctx.status = 201;
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

router.post("users.befriend", "/befriend", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if (ctx.request.body.myusername && ctx.request.body.friendusername) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.myusername}});
      if (!user) {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.myusername}.`);
      }
      const friend = await ctx.orm.User.findOne({where:{username:ctx.request.body.friendusername}});
      if (!friend) {
        throw Error(`No se encontró el usuario de tu amigo con username ${ctx.request.body.friendusername}.`);
      }
      if (user.id == friend.id) {
        throw Error(`Ya eres amigx de ti mismx c;`);
      }
      let msg;
      let friendship = await ctx.orm.Friend.findOne({
        where: {
          [Op.or]: [
            { frienderid: user.id, befriendedid: friend.id },
            { frienderid: friend.id, befriendedid: user.id }
          ]
        }
      });
      if (friendship) {
        if (friendship.status == 'FRENS') {
          throw Error(`Tu y ${ctx.request.body.friendusername} ya tienen una linda amistad desde antes c:`);
        }
        else if (friendship.frienderid == user.id) {
          throw Error(`Ya le has enviado una solicitud de amistad a ${ctx.request.body.friendusername} anteriormente.`);
        }
        friendship.status = 'FRENS';
        friendship.save();
        msg = `¡La solicitud de amistad de ${ctx.request.body.friendusername} ha sido aceptada!`;
      }
      else {
        const info = {
          frienderid: user.id,
          befriendedid: friend.id,
        }
        friendship = await ctx.orm.Friend.create(info);
        msg = `¡Le has enviado una solicitud de amistad a ${ctx.request.body.friendusername}!`
      }
      ctx.body = {
        msg: msg,
        friendship: friendship
      };
      ctx.status = 201;
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "myusername" y el de tu amigx como "friendusername".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

router.post("users.unfriend", "/unfriend", async(ctx) => {
  try {
    // This stays like this for now, but when we have multiple sessions and a remote server,
    // the user id would be retrieved automatically.
    if(ctx.request.body.myusername && ctx.request.body.otherusername) {
      const user = await ctx.orm.User.findOne({where:{username:ctx.request.body.myusername}});
      if (!user) {
        throw Error(`No se encontró tu usuario con username ${ctx.request.body.myusername}.`)
      }
      const other = await ctx.orm.User.findOne({where:{username:ctx.request.body.otherusername}});
      if (!other) {
        throw Error(`No se encontró el usuario del usuario con username ${ctx.request.body.otherusername}.`)
      }
      const friendship = await ctx.orm.Friend.findOne({
        where: {
          [Op.or]: [
            {frienderid: other.id, befriendedid: user.id},
            {frienderid: user.id, befriendedid: other.id}
          ]
        }
      });
      let msg;
      if (!friendship) {
        throw Error(`No hay ni solicitud ni amistad por parte del usuario ${ctx.request.body.otherusername}.`)
      }
      else if (friendship.status == 'FRENS') {
        msg = `Amistad con ${ctx.request.body.otherusername} terminada.`;
      }
      else if (friendship.status == 'PENDING' && friendship.frienderid == user.id) {
        msg = `Solicitud de amistad a ${ctx.request.body.otherusername} cancelada.`;
      }
      else {
        msg = `Solicitud de amistad de ${ctx.request.body.otherusername} rechazada.`;
      }
      await friendship.destroy();
      ctx.body = {
        msg: msg,
      };
      ctx.status = 201;
    }
    else {
      throw Error('Se necesita entregar tu nombre de usuario como "myusername" y el de la otra persona como "otherusername".')
    }
  } catch(error) {
    ctx.body = {errorMessage: error.message, errorCode: error.code};
    ctx.status = 400;
  }
})

// ********** GETS **********

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

router.get("users.showtable", "/table/:id", async(ctx) => {
  try {
    const players_list = await ctx.orm.Player.findAll({where:{userid:ctx.params.id, status:"READY"}});
    ctx.body = players_list;
    ctx.status = 200;
  } catch(error) {
    ctx.body = error;
    ctx.status = 400;
  }
})

module.exports = router;