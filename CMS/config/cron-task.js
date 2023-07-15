module.exports = {
  '*/1 * * * *': async () => {
    await publishNotifications();
  },
  '0 10 * * *': async () => {
    await strapi
      .plugin('data-resolving-task')
      .service('projectService')
      .updateProjectData();
  },
  '1 10 * * * ': async () => {
    await strapi
      .plugin('data-resolving-task')
      .service('moviesService')
      .updateReviews();
  },
  '2 10 * * *': async () => {
    await strapi
      .plugin('data-resolving-task')
      .service('seriesService')
      .updateAllSeries();
  },
  '3 10 * * *': async () => {
    await strapi
      .plugin('data-resolving-task')
      .service('seriesService')
      .updateSeasons();
  }
};

async function publishNotifications() {
  // fetch articles to publish;
  const draftArticleToPublish = await strapi.entityService.findMany('plugin::strapi-plugin-fcm.fcm-notification', {
    publicationState: 'preview', // preview returns both draft and published entries
    filters: {
      publishedAt: {
        $null: true, // so we add another condition here to filter entries that have not been published
      },
      publish_at: {
        $lt: new Date() // and we keep only articles with a 'publish_at' datetime value that is lower than the current datetime
      }
    }
  });
  // update the publish_at of articles previously fetched
  await Promise.all(draftArticleToPublish.map(article => {
    return strapi.entityService.update('plugin::strapi-plugin-fcm.fcm-notification', article.id, {
      data: {
        publishedAt: new Date(),
      }
    });
  }))
}
