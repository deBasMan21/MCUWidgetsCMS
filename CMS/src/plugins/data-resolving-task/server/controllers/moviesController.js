'use strict';

module.exports = ({ strapi }) => ({
  async updateReviews() {
    await strapi
      .plugin('data-resolving-task')
      .service('moviesService')
      .updateReviews();
  }
});
