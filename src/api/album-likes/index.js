const AlbumLikesHandler = require('./albumLikesHandler');
const AlbumLikesDAL = require('./albumLikesDAL');
const routes = require('./routes');

/**
 * Hapi AlbumLikes Plugin
 *
 * Handles all the album likes related routes.
 */
const albumLikesPlugin = {
  name: 'albumLikes',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService, cacheService: CacheService}} options - Plugin options
   */
  register: async (server, { dbService, cacheService }) => {
    const albumLikesDAL = new AlbumLikesDAL(dbService, cacheService);
    const albumLikesHandler = new AlbumLikesHandler(albumLikesDAL);
    server.route(routes(albumLikesHandler));
  },
};

module.exports = albumLikesPlugin;
