const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');

const Payload = require('../pojos/Payload');

class PayloadAssetService {
	static #FOLDER_NAME = 'CATALYST_AS_BUFFER';

	/**
	 *
	 * @type {string}
	 * @private
	 */
	#basePath;
	/**
	 *
	 * @type {CatalystApp}
	 * @private
	 */
	#catalystApp;

	/**
	 *
	 * @param {CatalystApp} catalystApp
	 * @param {Payload} payload
	 */
	constructor(catalystApp, payload) {
		this.#catalystApp = catalystApp;
		this.#basePath = payload.getRowId();
	}

	/**
	 *
	 * @async
	 * @param {string} fileName
	 * @returns {Promise<void>}
	 */
	async deleteAsset(fileId) {
		const folder = this.#catalystApp
			.filestore()
			.folder(PayloadAssetService.#FOLDER_NAME);

		await folder.deleteFile(fileId);
	}

	/**
	 *
	 * @static
	 * @param {CatalystApp} catalystApp
	 * @param {Payload} payload
	 * @returns {PayloadAssetService}
	 */
	static getInstance(catalystApp, payload) {
		return new PayloadAssetService(catalystApp, payload);
	}
}

module.exports = PayloadAssetService;
