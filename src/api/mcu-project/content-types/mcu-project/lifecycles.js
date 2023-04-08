module.exports = {
  afterCreate(event) {
    const { result, params } = event;

    const { id, Title, ReleaseDate, Type, Posters } = result

    if (ReleaseDate && ReleaseDate > new Date().toISOString()) {
      strapi.entityService.create('plugin::strapi-plugin-fcm.fcm-notification', {
        data: {
          title: Title,
          body: `${Title} (${Type}) releases today!`,
          targetType: 'topics',
          target: Type,
          publish_at: `${ReleaseDate}T08:00:00.000Z`,
          mcu_project: [id],
          image: Posters[0].PosterUrl,
          payload: {
            data: {
              url: `https://mcuwidgets.page.link/mcu/${id}`
            }
          }
        }
      })
    }
  }
};
