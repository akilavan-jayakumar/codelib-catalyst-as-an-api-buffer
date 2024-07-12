const fs = require('fs');
const os = require('os');
const path = require('path');

class DiskService {
	/**
	 *
	 * @static
	 * @private
	 * @type {string}
	 */
	static #directory = path.join(os.tmpdir(), 'api-buffer-server');

	/**
	 *
	 * @param {string} fileName
	 * @returns {string}
	 */
	#getPath(fileName) {
		return path.join(DiskService.#directory, fileName);
	}

	/**
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async #init() {
		if (!fs.existsSync(DiskService.#directory)) {
			await fs.promises.mkdir(DiskService.#directory, {
				recursive: true
			});
		}
	}

	/**
	 *
	 * @async
	 * @param {string} fileName
	 * @param {Buffer} buffer
	 * @returns {Promise<void>}
	 */
	async writeBufferToFile(fileName, buffer) {
		await this.#init();
		await fs.promises.writeFile(this.#getPath(fileName), buffer);
	}

	/**
	 *
	 * @async
	 * @param {string} fileName
	 * @returns {Promise<fs.ReadStream>}
	 */
	async getFileReadStream(fileName) {
		await this.#init();
		return fs.createReadStream(this.#getPath(fileName));
	}
}

module.exports = DiskService;
