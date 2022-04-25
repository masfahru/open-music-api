const AlbumsHandler = require('./albumsHandler');
const AlbumsDAL = require('./albumsDAL');
const AlbumValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi plugin to register the albums routes.
 * @type {Object}
 */
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { dbService }) => {
    const albumsDAL = new AlbumsDAL(dbService);
    const albumsHandler = new AlbumsHandler(albumsDAL, AlbumValidator);
    server.route(routes(albumsHandler));
  },
};
