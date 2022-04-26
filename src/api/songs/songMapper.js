/* eslint-disable camelcase */

/**
 * songDbToModel: map song object from database to proper Song object
 * @param {object} song - Song object from database
 * @returns {object} - Song object
 */
const songDbToModel = ({
  id, title, year, performer, genre, duration, album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

module.exports = { songDbToModel };
