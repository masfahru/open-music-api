const path = require('path');
/**
 * Function to route the request to the correct handler.
 * @param {AlbumsCoverHandler} handler
 * @returns {Route[]} list of routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{albumId}/covers',
    handler: handler.postAlbumCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 512000,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/uploads/images/{filename}',
    handler: (request, h) => h.file(path.join(__dirname, '../public/uploads/images', request.params.filename)),
  },
];

module.exports = routes;
