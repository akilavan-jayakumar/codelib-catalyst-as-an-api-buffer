const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');

const Payload = require('../pojos/Payload');

class PayloadService {
	/**
	 *
	 * @type {CatalystApp}
	 * @private
	 */
	#catalystApp;

	/**
	 *
	 * @param {CatalystApp} catalystApp
	 */
	constructor(catalystApp) {
		this.#catalystApp = catalystApp;
	}

	/**
	 *
	 * @param {Payload} payload
	 * @returns {Promise<void>}
	 */
	async createPayload(payload) {
		const result = await this.#catalystApp
			.datastore()
			.table('Payload')
			.insertRow(payload.getInsertPayload());

		payload.loadFromTableResult(result);
	}

	/**
	 *
	 * @param {Payload} payload
	 * @returns {Promise<void>}
	 */
	async updatePayload(payload) {
		await this.#catalystApp
			.datastore()
			.table('Payload')
			.updateRow(payload.getUpdatePayload());
	}

	/**
	 *
	 * @static
	 * @param {CatalystApp} catalystApp
	 * @returns {PayloadService}
	 */
	static getInstance(catalystApp) {
		return new PayloadService(catalystApp);
	}
}

module.exports = PayloadService;
