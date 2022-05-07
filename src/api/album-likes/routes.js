/**
 * Function to route the request to the correct handler.
 * @param {AlbumLikesHandler} handler
 * @returns {Route[]} list of routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: handler.postAlbumLikesHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: handler.getAlbumLikesHandler,
  },
];

module.exports = routes;
