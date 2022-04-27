/**
 * Function to route the request to the correct handler.
 * @param {PlaylistsHandler} handler
 * @returns {Route[]} list of routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylistsHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playListId}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playListId}/songs',
    handler: handler.postSongToPlaylistByIdHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playListId}/songs',
    handler: handler.getAllSongsInPlaylistByIdHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playListId}/songs',
    handler: handler.deleteSongFromPlaylistByIdHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
];

module.exports = routes;
