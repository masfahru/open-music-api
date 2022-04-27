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
  }

  /**
   * Create a new playlist.
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async getAllPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.#playlistsDAL.getAllPlaylists({
      owner: credentialId,
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async deletePlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistOwner({ playlistId, owner: credentialId });
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
   */
  async postSongToPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistOwner({ playlistId, owner: credentialId });
    const { songId } = this.#validator.validateSongId(request.payload);
    await this.#playlistsDAL.postSongToPlaylistById({ playlistId, songId });
    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan pada playlist',
      })
      .code(201);
  }

  /**
   * Get all song in the playlist.
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async getAllSongsInPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistOwner({ playlistId, owner: credentialId });
    const playlist = await this.#playlistsDAL.getAllSongsInPlaylistById({ playlistId });
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
   * Delete song from playlist by id
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async deleteSongFromPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.#playlistsDAL.verifyPlaylistOwner({ playlistId, owner: credentialId });
    const { songId } = this.#validator.validateSongId(request.payload);
    await this.#playlistsDAL.deleteSongFromPlaylistById({ playlistId, songId });
    return h
      .response({
        status: 'success',
        message: 'Lagu dalam playlist berhasil dihapus',
      })
      .code(200);
  }
};
