module.exports = {
    async up() {
      await strapi.db.transaction(async () => {
        // TODO: Retrieve all actors and directors and merge their first/last name into the single name field
        let actors = await strapi.entityService.findMany('api::actor.actor')

        await Promise.all(actors.map(async (actor) => {
            await strapi.entityService.update('api::actor.actor', actor.id, {
                data: {
                    name: `${actor.FirstName ?? ""} ${actor.LastName ?? ""}`
                }
            })
        }))
      });
    },
  };