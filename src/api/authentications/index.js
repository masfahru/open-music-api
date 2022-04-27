const AuthenticationsHandler = require('./authenticationsHandler');
const AuthenticationsDAL = require('./authenticationsDAL');
const authenticationPayloadValidator = require('./validator');
const authenticationTokenManager = require('./tokenize');
const routes = require('./routes');

/**
 * Hapi Authentications Plugin
 *
 * Handles all the authentications related routes.
 */
const authenticationsPlugin = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { dbService }) => {
    const authenticationsDAL = new AuthenticationsDAL(dbService);
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsDAL,
      authenticationPayloadValidator,
      authenticationTokenManager,
    );
    server.route(routes(authenticationsHandler));
  },
};
module.exports = authenticationsPlugin;
