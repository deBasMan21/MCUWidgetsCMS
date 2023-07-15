'use strict';

module.exports = ({ strapi }) => ({
  async retrieve(ctx) {
    // Check if id is provided
    if (!ctx.request.body.id) {
      ctx.throw(400, 'id is required');
    }

    // Get and call the imageservice to retrieve images
    await strapi
      .plugin('data-resolving-task')
      .service('imageService')
      .getImages(ctx.request.body.id);

    // Set response text
    ctx.body = "Images retrieved"
  },
});
