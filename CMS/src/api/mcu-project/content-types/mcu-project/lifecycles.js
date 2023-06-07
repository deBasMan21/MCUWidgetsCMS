module.exports = {
  beforeCreate(event) {
    if (event.params.data.Type) {
      event.params.data.isMCUProject = isMcuProject(event.params.data.Type)
    }
  },
  beforeUpdate(event) {
    if (event.params.data.Type) {
      event.params.data.isMCUProject = isMcuProject(event.params.data.Type)
    }
  },
  afterCreate(event) {
    const { result } = event;

    const { id, Title, ReleaseDate, Type, Posters } = result

    if (ReleaseDate && ReleaseDate > new Date().toISOString()) {
      console.log("in here so creating")
      strapi.entityService.create('plugin::strapi-plugin-fcm.fcm-notification', {
        data: {
          title: Title,
          body: `${Title} (${Type}) releases today!`,
          targetType: 'topics',
          target: getTopicName(Type),
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
    const { id, Title, ReleaseDate, Type, Posters, notifications } = result

    if (!notifications) { return }

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

      if (notification.target != getTopicName(Type)) {
        data.target = getTopicName(Type)
      }

      if (notification.title != Title || notification.target != Type) {
        data.body = `${Title} (${Type}) releases today!`
      }

      data.payload = {
        data: {
          url: `https://mcuwidgets.page.link/mcu/${id}`
        }
      }

      strapi.entityService.update('plugin::strapi-plugin-fcm.fcm-notification', notification.id, {
        data
      })
    })
  }
};

function isMcuProject(type) {
  return type == 'Serie' || type == 'Movie' || type == 'Special'
}

function getTopicName(type) {
  return isMcuProject(type) ? type : 'Related'
}