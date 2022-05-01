/**
 * Class to handle requests related to songs.
 */
module.exports = class SongsHandler {
  /**
   * Song Data Access Layer.
   * @type {SongsDAL}
   * @private
   */
  #songsDAL;

  /**
   * Song Validator.
   * @type {SongValidator}
   * @private
   */
  #songValidator;

  /**
   * @constructor
   * @param {SongsDAL} songsDAL - Songs Data Access Layer
   * @param {SongValidator} songValidator
   */
  constructor(songsDAL, songValidator) {
    this.#songsDAL = songsDAL;
    this.#songValidator = songValidator;
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.postSongHandler = this.postSongHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  /**
   * Get all songs.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Get query strings
   * 2. Get songs
   * 3. Put songs into response object
   * @return {Promise<response>} Hapi response object
   */
  async getAllSongsHandler(request, h) {
    const { title, year, performer, genre, duration, albumId } = request.query;
    const songs = await this.#songsDAL.getAllSongs({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    }).code(200);
  }

  /**
   * Get song by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Get song id
   * 2. Get song
   * 3. Put song into response object
   * @return {Promise<response>} Hapi response object
   */
  async getSongByIdHandler(request, h) {
    const { songId } = request.params;
    const song = await this.#songsDAL.getSongById({ songId });
    return h.response({
      status: 'success',
      data: {
        song,
      },
    }).code(200);
  }

  /**
   * Create a new song.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Validate request payload
   * 2. Save song to database
   * 3. Put song id into response object
   * @return {Promise<response>} Hapi response object
   */
  async postSongHandler(request, h) {
    const song = this.#songValidator.validate(request.payload);
    const songId = await this.#songsDAL.postSong(song);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    }).code(201);
  }

  /**
   * Update song by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Get song id from request params
   * 2. Validate request payload
   * 3. Update song
   * return success message
   * @return {Promise<response>} Hapi response object
   */
  async putSongByIdHandler(request, h) {
    const { songId } = request.params;
    const song = this.#songValidator.validate(request.payload);
    song.id = songId;
    await this.#songsDAL.putSongById(song);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    }).code(200);
  }

  /**
   * Delete song by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Get song id from request params
   * 2. Delete song
   * 3. Return success message
   * @return {Promise<response>} Hapi response object
   */
  async deleteSongByIdHandler(request, h) {
    const { songId } = request.params;
    await this.#songsDAL.deleteSongById({ songId });
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    }).code(200);
  }
};
