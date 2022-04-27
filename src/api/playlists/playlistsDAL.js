const { nanoid } = require('nanoid');
const {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} = require('open-music-api-exceptions');

/**
 * Class of Database access layer (DAL) for the playlists.
 * @class
 */
module.exports = class PlaylistsDAL {
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
   * Create a new playlist.
   * @async
   * @param {{name: string, owner: string}}
   * @returns {Promise<object>} - Playlist object
   * @throws {InvariantError} - Invalid playlist or playlist already exists or database error
   */
  async postPlaylist({ name, owner }) {
    const id = `playlist-${nanoid()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Get all playlists.
   * @async
   * @param {{owner: string}}
   * @returns {Promise<object[]>} - List of playlists
   * @throws {NotFoundError}
   */
  async getAllPlaylists({ owner }) {
    const query = {
      text: `SELECT playlists.id, name, username
      FROM playlists LEFT JOIN users 
      ON playlists.owner = users.id
      WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this.#dbService.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Belum ada playlist yang ditambahkan');
    }

    return result.rows;
  }

  /**
   * Delete playlist by id.
   * @async
   * @param {{playListId: string}} - Playlist Id
   * @returns {void}
   * @throws {NotFoundError}
   */
  async deletePlaylistById({ playListId }) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playListId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. Id tidak ditemukan');
    }
  }

  /**
   * Verify playlist owner
   * @async
   * @param {{playListId: string, owner:string}}
   * @returns {void}
   * @throws {AuthorizationError}
   */
  async verifyPlaylistOwner({ playListId, owner }) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playListId],
    };
    const result = await this.#dbService.query(query);
    if (result.rows[0] && result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki hak akses');
    }
  }

  /**
   * Post Song to playlist by id
   * @async
   * @param {{playListId: string, songId: string}} - Playlist Id and Song Id
   * @returns {void}
   * @throws {NotFoundError}
   */
  async postSongToPlaylistById({ playListId, songId }) {
    const client = await this.#dbService.getClient();
    try {
      await client.query('BEGIN');
      const queryPlaylist = {
        text: 'SELECT id FROM playlists WHERE id = $1',
        values: [playListId],
      };
      const playlist = await this.#dbService.query(queryPlaylist);
      if (!playlist.rows[0]) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
      const querySong = {
        text: 'SELECT id FROM songs WHERE id = $1',
        values: [songId],
      };
      const song = await client.query(querySong);
      if (!song.rows[0]) {
        throw new NotFoundError('Gagal menambahkan lagu. Lagu tidak ditemukan');
      }
      const id = `playlist-song-${nanoid()}`;
      const createdAt = new Date().toISOString();
      const query = {
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4) returning id',
        values: [id, playListId, songId, createdAt],
      };
      const res = await client.query(query);
      if (!res.rows[0].id) {
        throw new InvariantError('Gagal menambahkan lagu ke playlist');
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Get all songs in playlist by id
   * @async
   * @param {{playListId: string}} - Playlist Id
   * @return {Promise<object[]>} - Playlist with List of songs
   * @throws {NotFoundError}
   */
  async getAllSongsInPlaylistById({ playListId }) {
    const client = await this.#dbService.getClient();
    try {
      await client.query('BEGIN');
      const queryPlaylist = {
        text: `SELECT playlists.id, name, username 
        FROM playlists LEFT JOIN users 
        ON playlists.owner = users.id 
        WHERE playlists.id = $1`,
        values: [playListId],
      };

      const playlists = await this.#dbService.query(queryPlaylist);
      if (!playlists.rows[0]) {
        throw new NotFoundError('Playlist ID tidak ditemukan');
      }

      const querySongs = {
        text: `SELECT songs.id, title, performer
        FROM playlist_songs RIGHT JOIN songs 
        ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1`,
        values: [playListId],
      };

      const songs = await this.#dbService.query(querySongs);

      await client.query('COMMIT');

      playlists.rows[0].songs = songs.rows;
      return playlists.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Delete song from playlist by id
   * @async
   * @param {{playListId: string, songId: string}} - Playlist Id and Song Id
   * @returns {void}
   * @throws {NotFoundError}
   */
  async deleteSongFromPlaylistById({ playListId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 returning id',
      values: [playListId, songId],
    };
    const result = await this.#dbService.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist');
    }
  }
};
