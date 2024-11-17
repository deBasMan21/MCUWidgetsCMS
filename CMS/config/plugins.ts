export default ({ env }) => ({
  "strapi-plugin-populate-deep": {
    config: {
      defaultDepth: 5,
    },
  },
  // TODO: Fix caching
  // "rest-cache": {
  //   enabled: true,
  //   config: {
  //     provider: {
  //       name: "memory",
  //       options: {
  //         max: 32767,
  //         maxAge: 2678400,
  //       },
  //     },
  //     strategy: {
  //       contentTypes: [
  //         "api::mcu-project.mcu-project",
  //         "api::actor.actor",
  //         "api::director.director",
  //         "api::news-item.news-item",
  //         "api::page.page",
  //         "api::collection.collection",
  //         "api::homepage.homepage",
  //       ],
  //       enableXCacheHeaders: true,
  //       debug: true,
  //       hitpass: (ctx) => {
  //         return !ctx.request.headers.authorization;
  //       },
  //     },
  //   },
  // },
  "data-resolving-task": {
    enabled: true,
    resolve: "./src/plugins/data-resolving-task",
  },
  "strapi-plugin-fcm": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-fcm",
  },
});
