const { nanoid } = require('nanoid');
const { InvariantError, NotFoundError } = require('open-music-api-exceptions');
const { songDbToModel } = require('./songMapper');

/**
 * Database access layer (DAL) for the songs.
 * @class
 */
module.exports = class SongsDAL {
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
   * Get all songs.
   * @async
   * @param {object} [queryStrings]
   *
   * Algorithms:
   * 1. Create base query
   * 2. Add query string if available
   * 3. Execute query
   * If no result, @throws {NotFoundError}
   * 4. Map result to song model
   * 5. Return result
   * @returns {Promise<object[]>}
   */
  async getAllSongs(queryStrings) {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
      values: [],
    };

    Object.keys(queryStrings).forEach((key) => {
      if (queryStrings[key]) {
        if (query.values.length === 0) {
          query.text += ' WHERE';
        } else {
          query.text += ' AND';
        }
        query.values.push(`%${queryStrings[key]}%`);
        query.text += ` ${key} ILIKE $${query.values.length}`;
      }
    });
    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Belum ada lagu yang ditambahkan');
    }

    return result.rows;
  }

  /**
   * Get song by id.
   * @async
   * @param {{songId: string}}
   *
   * Algorithms:
   * 1. Get song by id
   * If no result, @throws {NotFoundError}
   * 3. Map result to song model
   * 4. Return result
   * @returns {Promise<object>}
   */
  async getSongById({ songId }) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return songDbToModel(result.rows[0]);
  }

  /**
   * Create a new song.
   * @async
   * @param {object} song
   *
   * Algorithms:
   * 1. Generate id
   * 2. Generate created_at and updated_at
   * 3. Insert song to database
   * If error, @throws {InvariantError}
   * 4. Return song id
   * @returns {Promise<object>}
   */
  async postSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Update song by id.
   * @async
   * @param {object} song
   *
   * Algorithms:
   * 1. Get song by id
   * If no result, @throws {NotFoundError}
   * 2. Update song
   * If error, @throws {InvariantError}
   *
   * @returns {Promise<void>}
   */
  async putSongById({ id, title, year, performer, genre, duration, albumId }) {
    const client = await this.#dbService.getClient();
    try {
      client.query('BEGIN');
      const songQuery = {
        text: 'SELECT id FROM songs WHERE id = $1',
        values: [id],
      };
      const songResult = await client.query(songQuery);
      if (!songResult.rows[0]) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }
      const updatedAt = new Date().toISOString();
      const updateQuery = {
        text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
        values: [
          title,
          year,
          performer,
          genre,
          duration,
          albumId,
          updatedAt,
          id,
        ],
      };
      const result = await client.query(updateQuery);
      if (!result.rows.length) {
        throw new InvariantError('Gagal memperbarui lagu.');
      }
      client.query('COMMIT');
    } catch (error) {
      client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete song by id.
   * @async
   * @param {{songId: string}}
   *
   * Algorithms:
   * 1. Get song by id
   * If no result, @throws {NotFoundError}
   * 2. Delete song
   * If error, @throws {InvariantError}
   * @returns {Promise<void>}
   */
  async deleteSongById({ songId }) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
};
