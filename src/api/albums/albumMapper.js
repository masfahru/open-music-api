/**
 * Map Object to Album Model using Object Literal
 */

/**
 * albumDbToModel: map album object from database to Album model
 * @param {object} album - Album object from database
 * @returns {object} - Album model
 */
const albumDbToModel = ({
  id, name, year, songs,
}) => ({
  id, name, year, songs,
});

module.exports = { albumDbToModel };
