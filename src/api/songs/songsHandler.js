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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
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
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    }).code(200);
  }

  /**
   * Get song by id.
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.#songsDAL.getSongById(id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    }).code(200);
  }

  /**
   * Create a new song.
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {ValidationError}
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async putSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = this.#songValidator.validate(request.payload);
    await this.#songsDAL.putSongById(id, song);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    }).code(200);
  }

  /**
   * Delete song by id.
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this.#songsDAL.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    }).code(200);
  }
};
