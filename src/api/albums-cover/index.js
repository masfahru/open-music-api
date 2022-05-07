const AlbumCoverHandler = require('./albumsCoverHandler');
const AlbumCoverDAL = require('./albumCoverDAL');
const albumCoverValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi AlbumCover Plugin
 *
 * Handles all the albums cover related routes.
 */
const albumCoverPlugin = {
  name: 'albumCover',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService, storageService: StorageService}} options - Plugin options
   */
  register: async (server, { dbService, storageService }) => {
    const albumCoverDAL = new AlbumCoverDAL(dbService);
    const albumCoverHandler = new AlbumCoverHandler(
      albumCoverDAL,
      storageService,
      albumCoverValidator,
    );
    server.route(routes(albumCoverHandler));
  },
};

module.exports = albumCoverPlugin;
