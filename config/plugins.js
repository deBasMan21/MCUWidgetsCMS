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
    'random-sort': {
      enabled: true,
    },
    email: {
      config: {
        provider: 'sendmail',
        providerOptions: {
          dkim: {
            privateKey: '',
            keySelector: 'default',
          }
        },
        settings: {
          defaultFrom: 'noreply@serverbuijsen.nl',
          defaultReplyTo: 'bbuijsen@gmail.com'
        }
      }
    }
});
