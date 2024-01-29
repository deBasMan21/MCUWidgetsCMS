import rabbitMQHelper, { EventType } from "../../../../helpers/rabbitMQHelper";

export default {
  async beforeCreate(event) {
    await retrieveTmdbId(event);
    createNotificationTopicName(event);
  },
  async beforeUpdate(event) {
    await retrieveTmdbId(event);
    createNotificationTopicName(event);
  },
  async afterCreate(event) {
    await createNotifications(event);
    await createOrdUpdateProject(event);
  },
  async afterUpdate(event) {
    await updateNotifications(event);
    await createOrdUpdateProject(event);
  },
  async afterDelete(event) {
    await deleteProject(event);
  },
};

type Project = {
  id: string;
  title: string;
  releaseDate: string;
  overview: string;
  imdb_id: string;
  categories: string;
  type: string;
  source: string;
  actors: [number];
  directors: [number];
  relatedProjects: [number];
  posterUrl?: string;
};
async function createOrdUpdateProject(event) {
  const { result } = event;
  const {
    id,
    Title,
    ReleaseDate,
    Type,
    Posters,
    Overview,
    imdb_id,
    Categories,
    actors,
    directors,
    related_projects,
    Source,
  } = result;

  if (!Posters || Posters.length == 0) {
    return;
  }

  let project: Project = {
    id: id,
    title: Title,
    releaseDate: ReleaseDate,
    overview: Overview,
    imdb_id: imdb_id,
    categories: Categories,
    type: Type,
    source: Source,
    actors: actors?.map((actor) => {
      return { id: actor.id };
    }),
    directors: directors?.map((director) => {
      return { id: director.id };
    }),
    relatedProjects: related_projects?.map((project) => {
      return { id: project.id };
    }),
  };

  if (Posters && Posters.length > 0) {
    project.posterUrl = Posters[0].PosterUrl;
  } else {
    let posters = strapi.entityService.findOne(
      "api::mcu-project.mcu-project",
      id,
      {
        // @ts-ignore: Posters is a relation and those are not included in the generated types
        fields: ["Posters"],
        populate: {
          Posters: true,
        },
      }
    );

    project.posterUrl = posters[0].PosterUrl;
  }

  await rabbitMQHelper.sendEvent(project, EventType.UPDATE_PROJECT);
}

async function deleteProject(event) {
  const { result } = event;
  const { id } = result;

  await rabbitMQHelper.sendEvent({ id }, EventType.DELETE_PROJECT);
}

async function retrieveTmdbId(event) {
  const imdb_id = event.params.data.imdb_id;
  if (event.params.data.tmdb_id) {
    return;
  }

  if (imdb_id) {
    const fetch = require("node-fetch");

    let tmdbRes = await fetch(
      `https://api.themoviedb.org/3/find/${imdb_id}?language=en-US&external_source=imdb_id`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    ).then((res) => res.json());

    event.params.data.tmdb_id =
      tmdbRes.movie_results[0]?.id ?? tmdbRes.tv_results[0]?.id;
  }
}

/// NOTIFICATIONS
async function createNotifications(event) {
  const { result } = event;

  const { id, Title, ReleaseDate, Type, Posters, Source, notificationTopic } =
    result;

  if (ReleaseDate && ReleaseDate > new Date().toISOString()) {
    await strapi.entityService.create(
      "plugin::strapi-plugin-fcm.fcm-notification",
      {
        data: {
          title: Title,
          body: `${Title} (${Type}) releases today!`,
          targetType: "topics",
          target: notificationTopic ?? "Unkown",
          publish_at: `${ReleaseDate}T08:00:00.000Z`,
          mcu_project: id,
          image: Posters[0].PosterUrl,
          isReleaseNotification: true,
          payload: `
        {
          data: {
            url: \`https://mcuwidgets.page.link/mcu/${id}\`
          }
        }
        `,
        },
      }
    );
  }
}

async function updateNotifications(event) {
  const { result } = event;
  const {
    id,
    Title,
    ReleaseDate,
    Type,
    Posters,
    notifications,
    notificationTopic,
  } = result;

  if (!notifications) {
    return;
  }

  let updateNotifications = notifications
    .filter((not) => not.isReleaseNotification)
    .filter((not) => not.publishedAt == null)
    .filter((not) => not.publish_at != null)
    .filter((not) => not.publish_at > new Date().toISOString());

  await Promise.all(
    updateNotifications.map(async (notification) => {
      let data: any = {};

      if (!notification.publish_at.startsWith(`${ReleaseDate}`)) {
        data.publish_at = `${ReleaseDate}T08:00:00.000Z`;
      }

      if (Posters.length > 0 && notification.image != Posters[0].PosterUrl) {
        data.image = Posters[0].PosterUrl;
      }

      if (notification.title != Title) {
        data.title = Title;
      }

      if (notification.title != Title) {
        data.body = `${Title} (${Type}) releases today!`;
      }

      if (notification.target != notificationTopic) {
        data.target = notificationTopic;
      }

      data.payload = {
        data: {
          url: `https://mcuwidgets.page.link/mcu/${id}`,
        },
      };

      await strapi.entityService.update(
        "plugin::strapi-plugin-fcm.fcm-notification",
        notification.id,
        {
          data,
        }
      );
    })
  );
}

function createNotificationTopicName(event) {
  const notificationTopic = event.params.data.notificationTopic;
  if (notificationTopic && notificationTopic !== "") {
    return;
  }

  const title = event.params.data.Title;
  if (!title) {
    return;
  }

  event.params.data.notificationTopic = title
    .replace(/ /g, "_")
    .replace(/:/g, "~");
}
