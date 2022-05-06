/**
 * Function to route the request to the correct handler.
 * @param {ExportPlaylistsHandler} handler
 * @returns {Route[]} - list of routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
];

module.exports = routes;
