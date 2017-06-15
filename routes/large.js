const loadProject = require('../utils/project');
const statusColor = require('../utils/status-color');

module.exports = {
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
};