const { ClientError } = require('open-music-exceptions');

/**
 * Class to handle requests related to albums.
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
   * @param {Object} _ - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async getAllAlbumsHandler(_, h) {
    try {
      const albums = await this.#albumsDAL.getAllAlbums();
      const response = h.response({
        status: 'success',
        data: {
          albums,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi galat pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Get album by id.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this.#albumsDAL.getAlbumById(id);
      const songs = await this.#albumsDAL.getSongByAlbumId(id);
      album.songs = songs;
      const response = h.response({
        status: 'success',
        data: {
          album,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi galat pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Create a new album.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
   */
  async postAlbumHandler(request, h) {
    try {
      const album = this.#albumValidator.validate(request.payload);
      const albumId = await this.#albumsDAL.postAlbum(album);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi galat pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Update album by id.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {ValidationError}
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async putAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = this.#albumValidator.validate(request.payload);
      await this.#albumsDAL.putAlbumById(id, album);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi galat pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Delete album by id.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {NotFoundError}
   * @throws {ServerError}
   */
  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.#albumsDAL.deleteAlbumById(id);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi galat pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
};
