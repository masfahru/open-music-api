/**
 * Class to handle requests related to playlists.
 * @class
 */
module.exports = class PlaylistsHandler {
  /**
   * Playlist Data Access Layer.
   * @type {PlaylistsDAL}
   * @private
   */
  #playlistsDAL;

  /**
   * Playlist Validator.
   * @type {PlaylistValidator}
   * @private
   */
  #validator;

  /**
   * @constructor
   * @param {PlaylistsDAL} playlistsDAL - Playlists Data Access Layer
   * @param {PlaylistValidator} playlistValidator
   */
  constructor(playlistsDAL, playlistValidator) {
    this.#playlistsDAL = playlistsDAL;
    this.#validator = playlistValidator;
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getAllPlaylistsHandler = this.getAllPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistByIdHandler = this.postSongToPlaylistByIdHandler.bind(this);
    this.getAllSongsInPlaylistByIdHandler = this.getAllSongsInPlaylistByIdHandler.bind(this);
    this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  /**
   * Create a new playlist.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Validate request payload
   * 2. Get user id from request auth credentials
   * 3. Insert playlist to database
   * 4. Put playlist id to request payload
   * @return {Promise<response>} Hapi response object
   */
  async postPlaylistHandler(request, h) {
    const { name } = this.#validator.validatePlaylist(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this.#playlistsDAL.postPlaylist({
      name,
      owner: credentialId,
    });
    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  /**
   * Get all playlists.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get user id from request auth credentials
   * 2. Get all playlists from database filtered by user id
   * 3. Put playlists to response
   * @return {Promise<response>} Hapi response object
   */
  async getAllPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.#playlistsDAL.getAllPlaylists({
      userId: credentialId,
    });
    return h
      .response({
        status: 'success',
        data: {
          playlists,
        },
      })
      .code(200);
  }

  /**
   * Delete playlist by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get playlist id from request params
   * 2. Get user id from request auth credentials
   * 3. Verify playlist owner
   * 4. Delete playlist from database
   * @return {Promise<response>} Hapi response object
   */
  async deletePlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistOwner({
      playlistId,
      owner: credentialId,
    });
    await this.#playlistsDAL.deletePlaylistById({ playlistId });
    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      })
      .code(200);
  }

  /**
   * Insert a song to playlist.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get playlist id from request params
   * 2. Get user id from request auth credentials
   * 3. Verify playlist owner
   * 4. Get song id by validating request payload
   * 5. Insert song to playlist
   * 6. add activity to playlist activities
   * @return {Promise<response>} Hapi response object
   */
  async postSongToPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistCollaboration({
      playlistId,
      userId: credentialId,
    });
    const { songId } = this.#validator.validateSongId(request.payload);
    await this.#playlistsDAL.postSongToPlaylistById({ playlistId, songId });
    await this.#playlistsDAL.addActivityToPlaylistActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'add',
    });
    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan pada playlist',
      })
      .code(201);
  }

  /**
   * Get all song in the playlist.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get playlist id from request params
   * 2. Get user id from request auth credentials
   * 3. Verify playlist owner
   * 4. Get all songs from playlist
   * @return {Promise<response>} Hapi response object
   */
  async getAllSongsInPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistCollaboration({
      playlistId,
      userId: credentialId,
    });
    const playlist = await this.#playlistsDAL.getAllSongsInPlaylistById({
      playlistId,
    });
    return h
      .response({
        status: 'success',
        data: {
          playlist,
        },
      })
      .code(200);
  }

  /**
   * Get Playlist Activities
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get playlist id from request params
   * 2. Get user id from request auth credentials
   * 3. Verify playlist owner
   * 4. Get all activities from playlist
   * @return {Promise<response>} Hapi response object
   */
  async getPlaylistActivitiesHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistOwner({
      playlistId,
      owner: credentialId,
    });
    const data = await this.#playlistsDAL.getPlaylistActivities({ playlistId });
    return h
      .response({
        status: 'success',
        data,
      })
      .code(200);
  }

  /**
   * Delete song from playlist by id
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get playlist id from request params
   * 2. Get user id from request auth credentials
   * 3. Verify playlist owner
   * 4. Get song id from request params
   * 5. Delete song from playlist
   * 6. add activity to playlist activities
   * @return {Promise<response>} Hapi response object
   */
  async deleteSongFromPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistCollaboration({
      playlistId,
      userId: credentialId,
    });
    const { songId } = this.#validator.validateSongId(request.payload);
    await this.#playlistsDAL.deleteSongFromPlaylistById({ playlistId, songId });
    await this.#playlistsDAL.addActivityToPlaylistActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
    });
    return h
      .response({
        status: 'success',
        message: 'Lagu dalam playlist berhasil dihapus',
      })
      .code(200);
  }
};
