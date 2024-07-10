const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');

const Payload = require('../pojos/Payload');

class PayloadAssetService {
	/**
	 *
	 * @type {Record<string,string>}
	 * @private
	 */
	#files;
	/**
	 *
	 * @type {CatalystApp}
	 * @private
	 */
	#catalystApp;

	#FOLDER_NAME = 'CATALYST_AS_BUFFER';

	/**
	 *
	 * @param {CatalystApp} catalystApp
	 * @param {Payload} payload
	 */
	constructor(catalystApp, payload) {
		this.#catalystApp = catalystApp;
		this.#files = payload.getFiles();
	}

	/**
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async flushAssets() {
		const folder = this.#catalystApp.filestore().folder(this.#FOLDER_NAME);
		for (const fileId of Object.values(this.#files)) {
			await folder.deleteFile(fileId);
		}
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
