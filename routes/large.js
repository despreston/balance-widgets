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
    let { nudgeUsers } = request.pre.project;

    if (request.pre.project.Past) {
      lastUpdated = new Date(request.pre.project.Past.lastUpdated).toLocaleDateString();
    }

    if (nudgeUsers.length > 5) {
      request.pre.project.nudgeUsers = nudgeUsers.slice(0,5);
    }

    function getNudgeText () {
      const numOfNudgers = nudgeUsers.length;

      switch (true) {
        case (numOfNudgers < 1)   : return null;
        case (numOfNudgers === 1) : return 'wants an update';
        case (numOfNudgers < 6)   : return 'want an update';
        case (numOfNudgers > 6)   : return `+${numOfNudgers -5} want an update`;
        default                   : return null;
      }
    }

    reply.view('large', {
      lastUpdated,
      nudgeText: getNudgeText(),
      color: statusColor(new Date(request.pre.project.lastUpdated)),
      isFinished: request.pre.project.status === 'finished',
      project: request.pre.project
    });
  }
};