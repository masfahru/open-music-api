/**
 * Class to handle requests related to albums.
 * @class
 */
module.exports = class AlbumCoverHandler {
  /**
   * Album Data Access Layer.
   * @type {AlbumCoversDAL}
   * @private
   */
  #albumCoversDAL;

  /**
   * Storage Services.
   * @type {StorageService}
   * @private
   */
  #storageService;

  /**
   * Album Validator.
   * @type {AlbumCoverValidator}
   * @private
   */
  #validator;

  /**
   * @constructor
   * @param {AlbumCoversDAL} albumCoversDAL
   * @param {StorageService} storageService
   * @param {AlbumCoverValidator} validator
   */
  constructor(albumCoversDAL, storageService, validator) {
    this.#albumCoversDAL = albumCoversDAL;
    this.#storageService = storageService;
    this.#validator = validator;
    this.postAlbumCoversHandler = this.postAlbumCoversHandler.bind(this);
  }

  /**
   * Post Album Covers Handler.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Validate cover payload in request
   * 2. get existing cover album
   * 3. delete existing cover album
   * 4. upload new cover album
   * 3. Put created album id in response
   *
   * @return {Promise<response>} Hapi response object
   */
  async postAlbumCoversHandler(request, h) {
    const { albumId } = request.params;
    const { cover } = this.#validator.validateHeaders(request.payload);
    const currentCover = await this.#albumCoversDAL.getAlbumCover({ albumId });
    if (currentCover) {
      await this.#storageService.deleteFile(currentCover);
    }
    const filename = await this.#storageService.writeFile(cover, cover.hapi);
    await this.#albumCoversDAL.postAlbumCover({ albumId, filename });
    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
};
