const fs = require('fs');

module.exports = class StorageService {
  /**
   * Root folder
   * @private
   */
  #folder;

  /**
   * @constructor
   * @param {string} path - Path to the storage
   */
  constructor(folder) {
    this.#folder = folder;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  /**
   * @method writeFile
   *
   * @param {Stream} file
   * @param {object} meta - Meta data
   */
  writeFile(file, meta) {
    const filename = `${+new Date()}_${meta.filename.replace(/\s/g, '_')}`;
    const path = `${this.#folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  deleteFile(filename) {
    const path = `${this.#folder}/${filename}`;
    fs.unlinkSync(path);
  }
};
