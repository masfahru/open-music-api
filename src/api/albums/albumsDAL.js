const { nanoid } = require('nanoid');
const { InvariantError, NotFoundError } = require('open-music-exceptions');

/**
 * Database access layer (DAL) for the albums.
 * @class
 */
module.exports = class AlbumsDAL {
  /**
   * Database Services
   * @private
   */
  #dbService;

  /**
   * @constructor
   * @param {object} dbService - Database Service
   */
  constructor(dbService) {
    this.#dbService = dbService;
  }

  /**
   * Get all albums.
   * @async
   * @returns {Promise<object[]>} - List of albums
   * @throws {NotFoundError}
   */
  async getAllAlbums() {
    const query = {
      text: 'SELECT id, name, year FROM albums',
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Belum ada album yang ditambahkan');
    }

    return result.rows;
  }

  /**
   * Get album by id.
   * @async
   * @param {string} id - Album id
   * @returns {Promise<object>} - Album object
   * @throws {NotFoundError}
   */
  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * Get all songs by album id.
   * @async
   * @param {string} albumId - Album id
   * @returns {Promise<object[]>} - List of songs
   */
  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      return null;
    }

    return result.rows;
  }

  /**
   * Create a new album.
   * @async
   * @param {object} album - Album object (without id)
   * @returns {Promise<object>} - Album object
   * @throws {InvariantError} - Invalid album or album already exists or database error
   */
  async postAlbum({ name, year }) {
    const id = `album-${nanoid()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [
        id,
        name,
        year,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Update album by id.
   * @async
   * @param {string} id - Album id
   * @param {object} album - Album object (without id)
   * @returns {void}
   * @throws {NotFoundError}
   */
  async putAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  /**
   * Delete album by id.
   * @async
   * @param {string} id - Album id
   * @returns {void}
   * @throws {NotFoundError}
   */
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
};
