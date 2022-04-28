const { nanoid } = require('nanoid');
const {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} = require('open-music-api-exceptions');

/**
 * Class of Database access layer (DAL) for the Collaborations.
 * @class
 */
module.exports = class CollaborationsDAL {
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
   * Verify Playlist Owner.
   * @async
   * @param {{playlistId: string, owner: string}}
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   * @throws {AuthorizationError}
   */
  async verifyPlaylistOwner({ playlistId, owner }) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this.#dbService.query(query);
    if (result.rows[0] && result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki hak akses');
    }
  }

  /**
   * Add Collaborator to playlist.
   * @async
   * @param {{playlistId: string, userId: string}}
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   * @throws {InvariantError}
   * @throws {AuthorizationError}
   */
  async postCollaboration({ playlistId, userId }) {
    const client = await this.#dbService.getClient();
    const id = `collaboration-${nanoid()}`;
    const createdAt = new Date().toISOString();
    try {
      await client.query('BEGIN');
      const userQuery = {
        text: 'SELECT id FROM users WHERE id = $1',
        values: [userId],
      };
      const user = await client.query(userQuery);
      if (!user.rows[0]) {
        throw new NotFoundError('User tidak ditemukan');
      }
      const playlistQuery = {
        text: 'SELECT id FROM playlists WHERE id = $1',
        values: [playlistId],
      };
      const playlist = await client.query(playlistQuery);
      if (!playlist.rows[0]) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
      const query = {
        text:
          'INSERT INTO collaborations VALUES ($1, $2, $3, $4) RETURNING id',
        values: [
          id,
          playlistId,
          userId,
          createdAt,
        ],
      };
      const res = await client.query(query);
      if (!res.rows.length) {
        throw new InvariantError('Gagal menambahkan kontributor');
      }
      await client.query('COMMIT');
      return res.rows[0].id;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete Collaborator from playlist.
   * @async
   * @param {{playlistId: string, userId: string}}
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   * @throws {InvariantError}
   */
  async deleteCollaboration({ playlistId, userId }) {
    const client = await this.#dbService.getClient();
    try {
      await client.query('BEGIN');
      const queryId = {
        text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
        values: [playlistId, userId],
      };
      const resId = await this.#dbService.query(queryId);
      if (!resId.rows[0]) {
        throw new NotFoundError('Collaborator tidak ditemukan');
      }
      const queryDelete = {
        text: 'DELETE FROM collaborations WHERE id = $1 RETURNING id',
        values: [resId.rows[0].id],
      };
      const resDelete = await this.#dbService.query(queryDelete);
      if (!resDelete.rows.length) {
        throw new InvariantError('Gagal menghapus collaborator');
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};
