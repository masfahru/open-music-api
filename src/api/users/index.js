const UsersHandler = require('./usersHandler');
const UsersDAL = require('./usersDAL');
const UserValidator = require('./validator');
const routes = require('./routes');

/**
 * Hapi plugin to register the users routes.
 * @type {Object}
 */
module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { dbService }) => {
    const usersDAL = new UsersDAL(dbService);
    const usersHandler = new UsersHandler(usersDAL, UserValidator);
    server.route(routes(usersHandler));
  },
};
