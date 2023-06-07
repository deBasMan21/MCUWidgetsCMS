const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('MYSQL_HOST', '127.0.0.1'),
      port: env('MYSQL_PORT', 3306),
      database: env('MYSQL_DB', 'strapi_db'),
      user: env('MYSQL_USER', 'strapi'),
      password: env('MYSQL_PWD', ''),
    },
    debug: false,
  },
});
