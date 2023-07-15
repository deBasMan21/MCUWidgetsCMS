'use strict';

module.exports = ({ strapi }) => ({
  async updateAllSeries(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('seriesService')
      .updateAllSeries();

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
