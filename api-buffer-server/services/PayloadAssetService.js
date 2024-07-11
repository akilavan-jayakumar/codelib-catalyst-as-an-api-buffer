const fs = require('fs');
const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');

const Payload = require('../pojos/Payload');

class PayloadAssetService {
	static #FOLDER_NAME = 'CATALYST_AS_BUFFER';

	/**
	 *
	 * @type {Payload}
	 * @private
	 */
	#payload;
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
		this.#payload = payload;
		this.#catalystApp = catalystApp;
	}

	/**
	 *
	 * @async
	 * @param {string} fileName
	 * @param {fs.ReadStream} readStream
	 * @returns {Promise<void>}
	 */
	async uploadAsset(fileName, readStream) {
		return this.#catalystApp
			.filestore()
			.folder(PayloadAssetService.#FOLDER_NAME)
			.uploadFile({
				code: readStream,
				name: fileName
			})
			.then((fileDetail) => fileDetail.id);
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
