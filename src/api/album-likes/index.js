const AlbumLikesHandler = require('./albumLikesHandler');
const AlbumLikesDAL = require('./albumLikesDAL');
const routes = require('./routes');

/**
 * Hapi AlbumLikes Plugin
 *
 * Handles all the album likes related routes.
 */
const albumLikesPlugin = {
  name: 'albumlikes',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService}} options - Plugin options
   */
  register: async (server, { dbService }) => {
    const albumLikesDAL = new AlbumLikesDAL(dbService);
    const albumLikesHandler = new AlbumLikesHandler(albumLikesDAL);
    server.route(routes(albumLikesHandler));
  },
};

module.exports = albumLikesPlugin;
