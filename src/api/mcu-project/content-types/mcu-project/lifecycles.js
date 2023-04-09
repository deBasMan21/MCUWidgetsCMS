module.exports = {
  afterCreate(event) {
    const { result } = event;

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
          isReleaseNotification: true,
          payload: {
            data: {
              url: `https://mcuwidgets.page.link/mcu/${id}`
            }
          }
        }
      })
    }
  },
  afterUpdate(event) {
    const { result } = event;
    const { Title, ReleaseDate, Type, Posters, notifications } = result

    let updateNotifications = notifications
      .filter((not) => not.isReleaseNotification)
      .filter((not) => not.publishedAt == null)
      .filter((not) => not.publish_at != null)
      .filter((not) => not.publish_at > new Date().toISOString())

    updateNotifications.forEach((notification) => {
      let data = {}

      if (!notification.publish_at.startsWith(`${ReleaseDate}`)) {
        data.publish_at = `${ReleaseDate}T08:00:00.000Z`
      }

      if(Posters.length > 0 && notification.image != Posters[0].PosterUrl) {
        data.image = Posters[0].PosterUrl
      }

      if (notification.title != Title) {
        data.title = Title
      }

      if (notification.target != Type) {
        data.target = Type
      }

      if (notification.title != Title || notification.target != Type) {
        data.body = `${Title} (${Type}) releases today!`
      }

      strapi.entityService.update('plugin::strapi-plugin-fcm.fcm-notification', notification.id, {
        data
      })
    })
  }
};
