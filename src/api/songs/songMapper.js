/* eslint-disable camelcase */

/**
 * @typedef Song
 * @property {string} id - Song id
 * @property {string} title - Song title
 * @property {number} year - Song release year
 * @property {string} performer - Song performer
 * @property {string} genre - Song genre
 * @property {number} duration - Song duration
 * @property {string} albumId - Song album id
 */

/**
 * songDbToModel: map song object from database to proper Song object
 * @param {object} song - Song object from database
 * @returns {Song} Song object
 */
const songDbToModel = ({
  id, title, year, performer, genre, duration, album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

module.exports = { songDbToModel };
