/**
 * Class to handle requests related to collaborations.
 * @class
 */
module.exports = class CollaborationsHandler {
  /**
   * Collaborations Data Access Layer.
   * @type {CollaborationsDAL}
   * @private
   */
  #collaborationsDAL;

  /**
   * Collaborations Validator.
   * @type {CollaborationsValidator}
   * @private
   */
  #validator;

  /**
   * @constructor
   * @param {CollaborationsDAL} collaborationsDAL - Collaborations Data Access Layer
   * @param {CollaborationsValidator} collaborationsValidator
   */
  constructor(collaborationsDAL, collaborationsValidator) {
    this.#collaborationsDAL = collaborationsDAL;
    this.#validator = collaborationsValidator;
    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    this.deleteCollaborationsHandler = this.deleteCollaborationsHandler.bind(this);
  }

  /**
   * Add Collaborator to playlist.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @throws {AuthorizationError}
   * @throws {InvariantError}
   * @throws {NotFoundError}
   */
  async postCollaborationsHandler(request, h) {
    const { playlistId, userId } = this.#validator.validate(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this.#collaborationsDAL.verifyPlaylistOwner({ playlistId, owner: credentialId });
    const collaborationId = await this.#collaborationsDAL.postCollaboration({
      playlistId,
      userId,
    });
    return h
      .response({
        status: 'success',
        data: {
          collaborationId,
        },
      })
      .code(201);
  }

  /**
   * Delete Collaborator from playlist.
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   * @return {object} Hapi response object
   * @throws {AuthorizationError}
   * @throws {NotFoundError}
   * @throws {InvariantError}
   */
  async deleteCollaborationsHandler(request, h) {
    const { playlistId, userId } = this.#validator.validate(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this.#collaborationsDAL.verifyPlaylistOwner({ playlistId, owner: credentialId });
    await this.#collaborationsDAL.deleteCollaboration({
      playlistId,
      userId,
    });
    return h
      .response({
        status: 'success',
        message: 'Collaborator berhasil dihapus',
      })
      .code(200);
  }
};
