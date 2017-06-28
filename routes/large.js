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
  handler: ({ pre }, reply) => {
    if (pre.project.denied) {
      return reply.view('large', { denied: true });
    } else if (pre.project.notFound) {
      return reply.view('large', { notFound: true });
    }

    let { nudgeUsers, Past, status, lastUpdated } = pre.project;

    if (nudgeUsers && nudgeUsers.length > 5) {
      pre.project.nudgeUsers = nudgeUsers.slice(0,5);
    }

    function getNudgeText () {
      const numOfNudgers = nudgeUsers ? nudgeUsers.length : 0;

      switch (true) {
        case (numOfNudgers < 1)   : return null;
        case (numOfNudgers === 1) : return 'wants an update';
        case (numOfNudgers < 6)   : return 'want an update';
        case (numOfNudgers > 6)   : return `+${numOfNudgers -5} want an update`;
        default                   : return null;
      }
    }

    reply.view('large', {
      lastUpdated: new Date(lastUpdated).toLocaleDateString(),
      nudgeText: getNudgeText(),
      color: statusColor(new Date(lastUpdated)),
      isFinished: status === 'finished',
      project: pre.project
    });
  }
};
