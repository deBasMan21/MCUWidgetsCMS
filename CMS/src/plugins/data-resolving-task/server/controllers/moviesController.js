'use strict';

module.exports = ({ strapi }) => ({
  async updateReviews(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('moviesService')
      .updateReviews();

    ctx.body = "Reviews updated"
  }
});
