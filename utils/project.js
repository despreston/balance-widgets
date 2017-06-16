/**
 * Fetches the project info from Balance api
 * /projects/{project}
 */
const https  = require('https');
const http   = require('http');
const config = require('../common');

module.exports = (request, reply) => {
  const { host, protocol, port } = config.api;
  const { project } = request.params;
  const protocolFn = protocol === 'https' ? https : http;

  protocolFn.get(`${protocol}://${host}:${port}/projects/${project}`, res => {
    const { statusCode } = res;

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