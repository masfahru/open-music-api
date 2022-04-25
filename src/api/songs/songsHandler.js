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
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
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
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  /**
   * Get song by id.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.#songsDAL.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  /**
   * Create a new song.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
   */
  async postSongHandler(request, h) {
    const song = this.#songValidator.validate(request.payload);
    const songId = await this.#songsDAL.postSong(song);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Update song by id.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {ValidationError}
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async putSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = this.#songValidator.validate(request.payload);
    await this.#songsDAL.putSongById(id, song);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  /**
   * Delete song by id.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this.#songsDAL.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }
};
