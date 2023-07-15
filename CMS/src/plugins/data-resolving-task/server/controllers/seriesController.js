'use strict';

module.exports = ({ strapi }) => ({
  async updateAllSeries(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('seriesService')
      .updateAllSeries();

    ctx.body = "Series updated"
  },
  async updateSingleSerie(ctx) {
     // Check if id is provided
    if (!ctx.request.body.id) {
      ctx.throw(400, 'id is required');
    }

    await strapi
      .plugin('data-resolving-task')
      .service('seriesService')
      .updateSingleSerie(ctx.request.body.id);

    ctx.body = "Series updated"
  },
  async updateSeasons(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('seriesService')
      .updateSeasons();

    ctx.body = "Seasons updated"
  }
});
