const Router = require("koa-router");

const router = new Router();

router.get("cards", "/", async(ctx) => {
    try {
        const card = await ctx.orm.Card.findAll();
        ctx.body = card;
        ctx.status = 200;
      } catch(error) {
        ctx.body = error;
        ctx.status = 400;
      }
})


router.get("cards.show", "/:cardid", async(ctx) => {
    try {
      const card = await ctx.orm.Card.findOne({where:{id:ctx.params.cardid}});
      ctx.body = card;
      ctx.status = 200;
    } catch(error) {
      ctx.body = error;
      ctx.status = 400;
    }
})

module.exports = router;