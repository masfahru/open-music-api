/**
 * Class to handle requests related to albums.
 * @class
 */
module.exports = class AlbumsHandler {
  /**
   * Album Data Access Layer.
   * @type {AlbumsDAL}
   * @private
   */
  #albumsDAL;

  /**
   * Album Validator.
   * @type {AlbumValidator}
   * @private
   */
  #albumValidator;

  /**
   * @constructor
   * @param {AlbumsDAL} albumsDAL
   * @param {AlbumValidator} albumValidator
   */
  constructor(albumsDAL, albumValidator) {
    this.#albumsDAL = albumsDAL;
    this.#albumValidator = albumValidator;
    this.getAllAlbumsHandler = this.getAllAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  /**
   * Get all albums.
   * @async
   * @param {object} _ - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Get All Albums
   * 2. Put albums in response
   *
   * @return {Promise<response>} Hapi response object
   */
  async getAllAlbumsHandler(_, h) {
    const albums = await this.#albumsDAL.getAllAlbums();
    return h.response({
      status: 'success',
      data: {
        albums,
      },
    }).code(200);
  }

  /**
   * Get album by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Get Album by id
   * 2. Get list of songs with same album id
   * 3. Put list of song in album object
   * 4. Put album in response
   * @return {Promise<response>} Hapi response object
   */
  async getAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    const album = await this.#albumsDAL.getAlbumById({ albumId });
    const songs = await this.#albumsDAL.getSongByAlbumId({ albumId });
    album.songs = songs;
    return h.response({
      status: 'success',
      data: {
        album,
      },
    }).code(200);
  }

  /**
   * Create a new album.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Validate album data in request
   * 2. Create album based on validated album data
   * 3. Put created album id in response
   *
   * @return {Promise<response>} Hapi response object
   */
  async postAlbumHandler(request, h) {
    const album = this.#albumValidator.validate(request.payload);
    const albumId = await this.#albumsDAL.postAlbum(album);
    return h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    }).code(201);
  }

  /**
   * Update album by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Validate album data in request
   * 2. Update album based on validated album data
   * 3. Put updated album in response
   *
   * @return {Promise<response>} Hapi response object
   */
  async putAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    const album = this.#albumValidator.validate(request.payload);
    album.id = albumId;
    await this.#albumsDAL.putAlbumById(album);
    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    }).code(200);
  }

  /**
   * Delete album by id.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Algorithms:
   * 1. Delete album
   *
   * @return {Promise<response>} Hapi response object
   */
  async deleteAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    await this.#albumsDAL.deleteAlbumById({ albumId });
    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    }).code(200);
  }
};
