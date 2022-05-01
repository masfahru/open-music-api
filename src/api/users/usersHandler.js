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
   * @async
   * @param {object} request - Hapi request object
   * @param {object} h - Hapi response object
   *
   * Steps:
   * 1. Get user by validating request payload
   * 2. Create user
   * 3. Put user into response object
   * @return {Promise<response>} - Hapi response object
   */
  async postUserHandler(request, h) {
    const user = this.#userValidator.validate(request.payload);
    const userId = await this.#usersDAL.postUser(user);
    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    }).code(201);
  }
};
