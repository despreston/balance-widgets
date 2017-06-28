/**
 * Fetches the project info from Balance api
 * /projects/{project}
 */
const { host, protocol, port } = require('../common').api;
const protocolFn               = protocol === 'https' ? require('https') : require('http');

module.exports = (request, reply) => {
  const { project } = request.params;

  protocolFn.get(`${protocol}://${host}:${port}/projects/${project}`, res => {
    const { statusCode } = res;

    if (statusCode === 403) {
      return reply({ denied: true });
    }

    if (statusCode === 500 || statusCode === 404) {
      return reply({ notFound: true });
    }

    if (statusCode < 200 || statusCode > 299) {
      res.resume();
      return reply(new Error('Request failed with status code: ', statusCode));
    }

    let data = '';
    res.setEncoding('utf8');

    res.on('data', chunk => data += chunk);

    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        return reply(parsed);
      } catch (e) {
        return reply(e.message);
      }
    });
  })
  .on('error', e => reply(e.message));
}
