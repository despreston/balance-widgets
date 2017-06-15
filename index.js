const config      = require('./common');
const routes      = require('./routes');
const Hapi        = require('hapi');
const server      = new Hapi.Server();

server.connection({
  port: config.port,
  host: 'localhost'
});

server.register(require('vision'), err => {
  server.views({
    engines: {
      html: require('handlebars')
    },
    isCached: false,
    relativeTo: __dirname,
    path: 'templates',
    layout: 'index',
    layoutPath: 'templates/layouts',
    partialsPath: 'templates/partials'
  });

  server.route(routes);
});

server.start();