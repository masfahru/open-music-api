/**
 * Class to handle requests related to users.
 */
module.exports = class UsersHandler {
  /**
   * User Data Access Layer.
   * @type {UsersDAL}
   * @private
   */
  #usersDAL;

  /**
   * User Validator.
   * @type {UserValidator}
   * @private
   */
  #userValidator;

  /**
   * @constructor
   * @param {UsersDAL} usersDAL - Users Data Access Layer
   * @param {UserValidator} userValidator
   */
  constructor(usersDAL, userValidator) {
    this.#usersDAL = usersDAL;
    this.#userValidator = userValidator;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  /**
   * Create a new user.
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response object
   * @return {Object} Hapi response object
   * @public
   * @async
   * @throws {InvariantError}
   * @throws {ServerError}
   */
  async postUserHandler(request, h) {
    const user = this.#userValidator.validate(request.payload);
    const userId = await this.#usersDAL.postUser(user);
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
};
