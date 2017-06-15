const config      = require('./common');
const loadProject = require('./utils/project');
const statusColor = require('./utils/status-color');
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

  server.route({
    method: 'GET',
    path: '/large/{project}',
    config: {
      pre: [
        {
          method: loadProject,
          assign: 'project'
        }
      ]
    },
    handler: (request, reply) => {
      let lastUpdated = '';

      if (request.pre.project.Past) {
        lastUpdated = new Date(request.pre.project.Past.lastUpdated).toLocaleDateString();
      }

      reply.view('large', {
        lastUpdated,
        color: statusColor(new Date(request.pre.project.lastUpdated)),
        isFinished: request.pre.project.status === 'finished',
        project: request.pre.project
      });
    }
  });
});

server.start();