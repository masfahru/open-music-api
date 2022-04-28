/* eslint-disable max-len */
const CollaborationsHandler = require('./collaborationsHandler');
const CollaborationsDAL = require('./collaborationsDAL');
const collaborationValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi Collaborations Plugin
 *
 * Handles all the collaborations related routes.
 */
const collaborationsPlugin = {
  name: 'collaborations',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService}} options - Plugin options
   */
  register: async (server, { dbService }) => {
    const collaborationsDAL = new CollaborationsDAL(dbService);
    const collaborationsHandler = new CollaborationsHandler(collaborationsDAL, collaborationValidator);
    server.route(routes(collaborationsHandler));
  },
};

module.exports = collaborationsPlugin;
