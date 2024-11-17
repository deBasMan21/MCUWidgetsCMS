export async function publishNotifications() {
  // fetch articles to publish;
  const draftArticleToPublish = await strapi.documents('plugin::strapi-plugin-fcm.fcm-notification').findMany({
    status: "draft", // preview returns both draft and published entries
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
    return strapi.documents('plugin::strapi-plugin-fcm.fcm-notification').update({
      documentId: `${article.id}`,
      data: {
        publishedAt: new Date(),
      }
    });
  }))
}
