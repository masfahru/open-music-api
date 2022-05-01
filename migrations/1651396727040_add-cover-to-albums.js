/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    cover: {
      type: 'VARCHAR(50)',
      notNull: false,
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', ['cover']);
};
