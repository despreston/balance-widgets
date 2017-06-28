const config      = require('./common');
const routes      = require('./routes');
const Hapi        = require('hapi');
const server      = new Hapi.Server();

console.log(`
  Starting server.
  NODE_ENV: ${process.env.NODE_ENV}
  port: ${config.port}
`);

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

  server.realm.modifiers.route.prefix = config.prefix;
  server.route(routes);
});

server.on('response', request => {
  console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() +
    ' ' + request.url.path + '--> ' + request.response.statusCode);
});

server.start();
