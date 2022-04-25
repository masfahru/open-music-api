const SongsHandler = require('./songsHandler');
const SongsDAL = require('./songsDAL');
const SongValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi plugin to register the songs routes.
 * @type {Object}
 */
module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { dbService }) => {
    const songsDAL = new SongsDAL(dbService);
    const songsHandler = new SongsHandler(songsDAL, SongValidator);
    server.route(routes(songsHandler));
  },
};
