module.exports = class ExportPlaylistsHandler {
  /**
   * Email validator for the export playlists endpoint.
   * @type {ExportPlaylistsValidator}
   * @private
   */
  #validator;

  /**
   * Email validator for the export playlists endpoint.
   * @type {MessageBrokerProducerService}
   * @private
   */
  #messageBrokerService;

  /**
   * @constructor
   * @param {ExportPlaylistsDAL} dal
   * @param {ExportPlaylistsValidator} validator
   * @param {MessageBrokerProducerService} service
   */
  #dal;

  constructor(dal, validator, messageBrokerService) {
    this.#dal = dal;
    this.#validator = validator;
    this.#messageBrokerService = messageBrokerService;
    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  /**
   * Export Playlists Handler
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Validate request payload
   * 2. Validate Email
   * 3. Get Credentials
   * 4. Verify playlist owner
   * 5. Export playlist
   * @returns {Promise<response>} Hapi response object
   */
  async postExportPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { targetEmail } = this.#validator.validateEmail(
      request.payload,
    );
    const { id: credentialId } = request.auth.credentials;
    await this.#dal.verifyPlaylistCollaboration({
      playlistId,
      userId: credentialId,
    });
    const message = {
      playlistId,
      targetEmail,
    };
    await this.#messageBrokerService.sendMessage('export:playlists', message);
    return h
      .response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      })
      .code(201);
  }
};
