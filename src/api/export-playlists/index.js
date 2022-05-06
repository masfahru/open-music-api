/* eslint-disable max-len */
const ExportPlaylistsHandler = require('./exportPlaylistsHandler');
const ExportPlaylistsDAL = require('./exportPlaylistsDAL');
const exportPlaylistsValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi Export Playlists Plugin
 *
 * Handles all the export related routes.
 */
const exportPlaylistsPlugin = {
  name: 'export-playlists',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService, messageBrokerService: MessageBrokerService}} options
   */
  register: async (server, { dbService, messageBrokerService }) => {
    const exportPlaylistDAL = new ExportPlaylistsDAL(dbService);
    const exportPlaylistHandler = new ExportPlaylistsHandler(
      exportPlaylistDAL,
      exportPlaylistsValidator,
      messageBrokerService,
    );
    server.route(routes(exportPlaylistHandler));
  },
};

module.exports = exportPlaylistsPlugin;
