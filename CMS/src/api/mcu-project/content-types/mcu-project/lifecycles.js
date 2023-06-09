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
  const { id, Title, ReleaseDate, Type, Posters, Overview, imdb_id, Categories, actors, directors, related_projects } = result

  let project = {
    id: id,
    title: Title,
    releaseDate: ReleaseDate,
    overview: Overview,
    imdb_id: imdb_id,
    categories: Categories,
    posterUrl: Posters[0].PosterUrl,
    type: Type,
    actors: actors.map((actor) => { return { id: actor.id } }),
    directors: directors.map((director) => { return { id: director.id } }),
    relatedProjects: related_projects.map((project) => { return { id: project.id } })
  }

  console.log(project)
  try {
    const fetch = require('node-fetch')

    const result = await fetch(`http://mcu-widgets-recommendations-api:3000/api/project`, {
      method: 'post',
      body: JSON.stringify(project),
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

async function deleteProject(event) {
  const { result } = event
  const { id } = result

  console.log(id)
  try {
    const fetch = require('node-fetch')

    const result = await fetch(`http://mcu-widgets-recommendations-api:3000/api/project/${id}`, { method: 'delete' })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

/// HELPERS
function isMcuProject(type) {
  return type == 'Serie' || type == 'Movie' || type == 'Special'
}

function getTopicName(type) {
  return isMcuProject(type) ? type : 'Related'
}

/// NOTIFICATIONS
function createNotifications(event) {
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
}

function updateNotifications(event) {
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
