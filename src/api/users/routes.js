/**
 * Function to route the request to the correct handler.
 * @param {*} handler
 * @returns {Object[]} - list of routes
 */
module.exports = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];
