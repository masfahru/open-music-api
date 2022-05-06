const {
  NotFoundError,
  AuthorizationError,
} = require('open-music-api-exceptions');

/**
 * Class of Database access layer (DAL) for the playlists.
 * @class
 */
module.exports = class ExportPlaylistsDAL {
  /**
   * Database Services
   * @private
   */
  #dbService;

  /**
   * @constructor
   * @param {DbService} dbService - Database Service
   */
  constructor(dbService) {
    this.#dbService = dbService;
  }

  /**
   * Verify playlist collaboration
   * @async
   * @param {{playlistId: string, userId: string}}
   *
   * Steps:
   * 1. Get playlist data
   * if the playlist not found, @throws {NotFoundError}
   * 2. Check if the user is the owner of the playlist
   * if the user is the owner, it could be a collaborator
   * 3. Get the collaboration data
   * if the collaboration not found, @throws {AuthorizationError}
   * 4. If no error, means the user is a collaborator
   * @returns {Promise<void>}
   */
  async verifyPlaylistCollaboration({ playlistId, userId }) {
    const queryOwner = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this.#dbService.query(queryOwner);
    if (!result.rows[0]) {
      throw new NotFoundError(
        'Playlist Tidak ditemukan',
      );
    }
    if (result.rows[0].owner !== userId) {
      const queryCollaborator = {
        text: 'SELECT user_id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
        values: [playlistId, userId],
      };
      const collaborator = await this.#dbService.query(queryCollaborator);
      if (!collaborator.rows[0]) {
        throw new AuthorizationError('Anda tidak memiliki hak akses pada playlist ini');
      }
    }
  }
};
