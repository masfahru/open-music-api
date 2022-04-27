const SongsHandler = require('./songsHandler');
const SongsDAL = require('./songsDAL');
const songValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi Songs Plugin
 *
 * Handles all the songs related routes.
 */
const songsPlugin = {
  name: 'songs',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService}} options - Plugin options
   */
  register: async (server, { dbService }) => {
    const songsDAL = new SongsDAL(dbService);
    const songsHandler = new SongsHandler(songsDAL, songValidator);
    server.route(routes(songsHandler));
  },
};
module.exports = songsPlugin;
