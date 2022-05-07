const { serverConfig } = require('open-music-api-configs');

const generateImageUrl = (filename) => `http://${serverConfig.host}:${serverConfig.port}/uploads/images/${filename}`;
module.exports = { generateImageUrl };
