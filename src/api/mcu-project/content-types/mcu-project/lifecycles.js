module.exports = {
  afterCreate(event) {
    const { result, params } = event;

    const { id, Title, ReleaseDate, Type } = result

    if (ReleaseDate && ReleaseDate > new Date().toISOString()) {
      strapi.entityService.create('plugin::strapi-plugin-fcm.fcm-notification', {
        data: {
          title: Title,
          body: `${Title} (${Type}) releases today!`,
          targetType: 'topics',
          target: Type,
          publish_at: `${ReleaseDate}T08:00:00.000Z`,
          mcu_project: [id]
        }
      })
    }
  }
};
