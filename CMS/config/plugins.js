module.exports = ({ env }) => ({
    'strapi-plugin-populate-deep': {
        config: {
            defaultDepth: 5
        }
    },
    'entity-notes': {
      enabled: true,
    },
    'todo': {
      enabled: true,
    },
    'rest-cache': {
      config: {
        provider: {
          name: "memory",
          options: {
            max: 32767,
            maxAge: 3600
          }
        },
        strategy: {
          contentTypes: [
            "api::mcu-project.mcu-project",
            "api::actor.actor",
            "api::director.director"
          ],
          enableXCacheHeaders: true,
          debug: true,
          hitpass: (ctx) => {
            return !ctx.request.headers.authorization
          }
        }
      }
    },
    'duplicate-button': true,
    'data-resolving-task': {
      enabled: true,
      resolve: './src/plugins/data-resolving-task'
    },
});
