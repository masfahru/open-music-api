const { InvariantError } = require('open-music-api-exceptions');
const ExportNotesPayloadSchema = require('./schema');

/**
 *  Export Playlists Email Validator
 */
const ExportsPlaylistValidator = {
  /**
   * @method validateEmail
   * @param {{email: string}} payload - User Credentials
   * @returns {object}
   */
  validateEmail: (payload) => {
    const validationResult = ExportNotesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = ExportsPlaylistValidator;
