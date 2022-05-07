const AlbumCoversHandler = require('./albumCoversHandler');
const AlbumCoversDAL = require('./albumCoversDAL');
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
    const albumCoversDAL = new AlbumCoversDAL(dbService);
    const albumCoversHandler = new AlbumCoversHandler(
      albumCoversDAL,
      storageService,
      albumCoverValidator,
    );
    server.route(routes(albumCoversHandler));
  },
};

module.exports = albumCoverPlugin;
