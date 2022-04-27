/**
 * Function to route the request to the correct handler.
 * @param {UsersHandler} handler
 * @returns {Route[]} - list of routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];
module.exports = routes;
