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
   * @param {AlbumsDAL} albumsDAL - Albums Data Access Layer
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
   * @param {object} _ - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {ValidationError}
   * @throws {NotFoundError}
   * @throws {ServerError}
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
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
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
