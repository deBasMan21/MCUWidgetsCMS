export default ({ env }) => ({
  "strapi-plugin-populate-deep": {
    config: {
      defaultDepth: 5,
    },
  },
  "rest-cache": {
    provider: {
      name: "memory",
      options: {
        max: 32767,
        maxAge: 3600,
      },
    },
    strategy: {
      contentTypes: [
        "api::mcu-project.mcu-project",
        "api::actor.actor",
        "api::director.director",
      ],
      enableXCacheHeaders: true,
      debug: true,
      hitpass: (ctx) => {
        return !ctx.request.headers.authorization;
      },
    },
  },
  "data-resolving-task": {
    enabled: true,
    resolve: "./src/plugins/data-resolving-task",
  },
  "strapi-plugin-fcm": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-fcm",
  },
});
