const AlbumsHandler = require('./albumsHandler');
const AlbumsDAL = require('./albumsDAL');
const albumValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi Albums Plugin
 *
 * Handles all the albums related routes.
 */
const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService}} options - Plugin options
   */
  register: async (server, { dbService }) => {
    const albumsDAL = new AlbumsDAL(dbService);
    const albumsHandler = new AlbumsHandler(albumsDAL, albumValidator);
    server.route(routes(albumsHandler));
  },
};

module.exports = albumsPlugin;
