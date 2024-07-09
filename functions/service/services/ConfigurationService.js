/**
 * @typedef {import('zcatalyst-sdk-node/lib/catalyst-app').CatalystApp} CatalystApp
 */

class ConfigurationService {
	/**
	 * @type {CatalystApp}
	 * @private
	 */
	#catalystApp;

	/**
	 * @param {CatalystApp} catalystApp
	 */
	constructor(catalystApp) {
		this.#catalystApp = catalystApp;
	}

	/**
	 * @param {import('../pojos/Configuration')} configuration
	 * @return {Promise<void>}
	 */
	async createConfiguration(configuration) {
		await this.#catalystApp
			.datastore()
			.table('Configuration')
			.insertRow(configuration.getInsertPayload())
			.then((result) => configuration.loadFromTableResult(result));
	}

	/**
	 * @static
	 * @param {CatalystApp} catalystApp
	 * @returns {ConfigurationService}
	 */
	static getInstance(catalystApp) {
		return new ConfigurationService(catalystApp);
	}
}

module.exports = ConfigurationService;
