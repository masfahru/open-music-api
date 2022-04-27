const UsersHandler = require('./usersHandler');
const UsersDAL = require('./usersDAL');
const userValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi Users Plugin
 *
 * Handles all the users related routes.
 */
const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  /**
   * @method register
   * @param {Hapi.Server} server - Hapi Server
   * @param {{dbService: DbService}} options - Plugin options
   */
  register: async (server, { dbService }) => {
    const usersDAL = new UsersDAL(dbService);
    const usersHandler = new UsersHandler(usersDAL, userValidator);
    server.route(routes(usersHandler));
  },
};
module.exports = usersPlugin;
