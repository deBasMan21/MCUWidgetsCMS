module.exports = {
  afterCreate(event) {
    createNotifications(event)
    createProject(event)
  },
  afterUpdate(event) {
    updateNotifications(event)
    createProject(event)
  },
  afterDelete(event) {
    deleteProject(event)
  }
};

async function createProject(event) {
  const { result } = event
  const { id, Title, ReleaseDate, Type, Posters, Overview, imdb_id, Categories, actors, directors, related_projects, Source } = result

  if (!Posters || Posters.length == 0) { return }

  let project = {
    id: id,
    title: Title,
    releaseDate: ReleaseDate,
    overview: Overview,
    imdb_id: imdb_id,
    categories: Categories,
    type: Type,
    source: Source,
    actors: actors?.map((actor) => { return { id: actor.id } }),
    directors: directors?.map((director) => { return { id: director.id } }),
    relatedProjects: related_projects?.map((project) => { return { id: project.id } })
  }

  if (Posters && Posters.length > 0) {
    project.posterUrl = Posters[0].PosterUrl
  } else {
    let posters = strapi.entityService.findOne('api::mcu-project.mcu-project', id, {
      fields: ['Posters'],
      populate: {
        Posters: true
      }
    })

    project.posterUrl = posters[0].PosterUrl
  }

  try {
    const fetch = require('node-fetch')

    await fetch(`http://mcu-widgets-recommendations-api:3000/api/project`, {
      method: 'post',
      body: JSON.stringify(project),
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.log(error)
  }
}

async function deleteProject(event) {
  const { result } = event
  const { id } = result

  try {
    const fetch = require('node-fetch')

    await fetch(`http://mcu-widgets-recommendations-api:3000/api/project/${id}`, { method: 'delete' })
  } catch (error) {
    console.log(error)
  }
}

/// HELPERS
function getTopicName(type, source) {
  if (source == 'MCU') {
    return type
  } else {
    return 'Related'
  }
}

/// NOTIFICATIONS
function createNotifications(event) {
  const { result } = event;

  const { id, Title, ReleaseDate, Type, Posters, Source } = result

  if (ReleaseDate && ReleaseDate > new Date().toISOString()) {
    strapi.entityService.create('plugin::strapi-plugin-fcm.fcm-notification', {
      data: {
        title: Title,
        body: `${Title} (${Type}) releases today!`,
        targetType: 'topics',
        target: getTopicName(Type, Source),
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
}

function updateNotifications(event) {
  const { result } = event;
  const { id, Title, ReleaseDate, Type, Posters, notifications, Source } = result

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

    if (notification.target != getTopicName(Type, Source)) {
      data.target = getTopicName(Type, Source)
    }

    if (notification.title != Title || notification.target != getTopicName(Type, Source)) {
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
