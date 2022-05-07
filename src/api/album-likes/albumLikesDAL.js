const { nanoid } = require('nanoid');
const { InvariantError, NotFoundError } = require('open-music-api-exceptions');
/**
 * Class of Database access layer (DAL) for the album likes.
 * @class
 */
module.exports = class AlbumLikesDAL {
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
   * Check if album exists
   * @async
   * @param {{albumId:string}}
   * @returns {Promise<object>}
   */
  async checkAlbumExists({ albumId }) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError(`Album ${albumId} tidak ditemukan`);
    }
    return result.rows[0].id;
  }

  /**
   * Check if album is already liked
   * @async
   * @param {{albumId:string, userId: string}}
   * @returns {Promise<object>}
   */
  async isAlbumLiked({ albumId, userId }) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      return false;
    }
    return true;
  }

  /**
   * Post Album Like
   * @async
   * @param {{albumId:string, userId: string}}
   * @returns {Promise<object>}
   * @throws {InvariantError}
   */
  async postAlbumLikes({ albumId, userId }) {
    const id = `album-likes-${nanoid()}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3, $4) RETURNING id',
      values: [
        id,
        userId,
        albumId,
        createdAt,
      ],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new InvariantError('Gagal menyukai album');
    }

    return result.rows[0].id;
  }

  /**
   * Delete Album Like
   * @async
   * @param {{ albumId:string, userId: string }}
   * @returns {Promise<object>}
   * @throws {InvariantError}
   */
  async deleteAlbumLike({ albumId, userId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [
        albumId,
        userId,
      ],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new InvariantError('Gagal membatalkan suka album');
    }

    return result.rows[0].id;
  }

  /**
   * Get Album Likes
   * @async
   * @param {{albumId:string}}
   * @returns {Promise<object>}
   */
  async getAlbumLikes({ albumId }) {
    const query = {
      text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      return 0;
    }
    return parseInt(result.rows[0].count, 10);
  }
};
