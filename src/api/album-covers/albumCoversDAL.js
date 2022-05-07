const { InvariantError } = require('open-music-api-exceptions');
/**
 * Class of Database access layer (DAL) for the album covers.
 * @class
 */
module.exports = class AlbumCoverDAL {
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
   * Post Album Cover
   * @async
   * @param {{albumId:string, filename: string}}
   * @returns {Promise<object>}
   * @throws {InvariantError}
   */
  async postAlbumCover({ albumId, filename }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET cover_url=$1, updated_at=$2 WHERE id = $3 RETURNING id',
      values: [
        filename,
        updatedAt,
        albumId,
      ],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Cover Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Get Album Cover
   * @async
   * @param {{albumId:string}}
   * @returns {Promise<object>}
   */
  async getAlbumCover({ albumId }) {
    const query = {
      text: 'SELECT cover_url FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      return null;
    }
    return result.rows[0].cover_url;
  }
};
