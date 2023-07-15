'use strict';

module.exports = ({ strapi }) => ({
  async updateProjectData(ctx) {
    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .updateProjectData();

    ctx.body = "Project data updated"
  }
});
