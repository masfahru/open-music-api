const PlaylistsHandler = require('./playlistsHandler');
const PlaylistsDAL = require('./playlistsDAL');
const playlistValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi Playlists Plugin
 *
 * Handles all the playlists related routes.
 */
const playlistsPlugin = {
  name: 'playlists',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService}} options - Plugin options
   */
  register: async (server, { dbService }) => {
    const playlistsDAL = new PlaylistsDAL(dbService);
    const playlistsHandler = new PlaylistsHandler(playlistsDAL, playlistValidator);
    server.route(routes(playlistsHandler));
  },
};

module.exports = playlistsPlugin;
