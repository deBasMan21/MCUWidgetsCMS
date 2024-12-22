'use strict';

module.exports = ({ strapi }) => ({
  async updateProjectData(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .updateProjectData();

    ctx.body = "Project data updated"
  },
  async updateSingleProject(ctx) {
     // Check if id is provided
    if (!ctx.request.body.id) {
      ctx.throw(400, 'id is required');
    }

    // Get and call the projectservice to update the entry
    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .updateSingleProject(ctx.request.body.id);

      ctx.body = "Project data updated"
  },
  async updateCollections(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .getCollections();

    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .updateCollectionRelations();

    ctx.body = "Collections updated"
  },
  async updateActors(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .updateActors(ctx.request.body.id);
  }
});
