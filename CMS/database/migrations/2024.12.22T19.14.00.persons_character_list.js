module.exports = {
    async up() {
      await strapi.db.transaction(async () => {
        let actors = await strapi.entityService.findMany('api::actor.actor')

        await Promise.all(actors.map(async (actor) => {
            await strapi.entityService.update('api::actor.actor', actor.id, {
                data: {
                    characters: [
                        {
                            name: actor.Character
                        }
                    ]
                }
            })
        }))
      });
    },
  };