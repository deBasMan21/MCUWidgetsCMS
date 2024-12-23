module.exports = {
    async up() {
      await strapi.db.transaction(async () => {
        // TODO: Retrieve all actors and directors and merge their first/last name into the single name field
        let directors = await strapi.entityService.findMany('api::director.director')

        await Promise.all(directors.map(async (director) => {
            await strapi.entityService.update('api::director.director', director.id, {
                data: {
                    name: `${director.FirstName ?? ""} ${director.LastName ?? ""}`
                }
            })
        }))
      });
    },
  };