/* eslint-disable camelcase */

/**
 * songDbToModel: map song object from database to Song model
 * @param {object} song - Song object from database
 * @returns {object} - Song model
 */
const songDbToModel = ({
  id, title, year, performer, genre, duration, album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

module.exports = { songDbToModel };
