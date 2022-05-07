/* eslint-disable camelcase */
const { generateImageUrl } = require('../../utils/generateImageUrl');

/**
 * @typedef Album
 * @property {string} id - Album id
 * @property {string} name - Album name
 * @property {number} year - Album release year
 * @property {string} coverUrl - Album cover url
 */

/**
 * albumDbToModel: map album object from database to proper Album object
 * @param {object} album - Album object from database
 * @returns {Album} Album object
 */
const albumDbToModel = ({
  id, name, year, cover_url,
}) => ({
  id, name, year, coverUrl: (cover_url ? generateImageUrl(cover_url) : null),
});

module.exports = { albumDbToModel };
