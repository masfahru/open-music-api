const { InvariantError } = require('open-music-api-exceptions');
const { PlaylistPayloadSchema, PlaylistSongIdPayloadSchema } = require('./schema');

/**
 * Playlist object validator.
 */
const PlaylistValidator = {
  /**
   * @method validatePlaylist
   * @param {object} payload - Playlist object
   * @returns {object} - Validated album object
   * @throws {InvariantError} - If payload is not valid
   */
  validatePlaylist: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
  /**
   * @method validateSongId
   * @param {object} payload - SongId object
   * @returns {object} - Validated album object
   * @throws {InvariantError} - If payload is not valid
   */
  validateSongId: (payload) => {
    const validationResult = PlaylistSongIdPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    return payload;
  },
};

module.exports = PlaylistValidator;
