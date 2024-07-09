// Package Imports
const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');
const {
	CRON_TYPE,
	TARGET_TYPE
} = require('zcatalyst-sdk-node/lib/job-scheduling/enum');

// Local Imports
const CatalystJobConstants = require('../constants/CatalystJobConstants');

class CatalystJobService {
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
	 * @async
	 * @param {string} domain
	 * @param {string} configuration_id
	 *  @param {number} execute_in - execute_in should be in seconds
	 * @returns {Promise<void>}
	 */
	async executeConfigurationExecutorJob(
		domain,
		configuration_id,
		execute_in
	) {
		await this.#catalystApp.jobScheduling().CRON.createCron({
			cron_name: Date.now(),
			cron_status: true,
			cron_type: CRON_TYPE.ONETIME,
			cron_detail: {
				time_of_execution: Math.floor(Date.now() / 1000) + execute_in
			},
			job_meta: {
				target_type: TARGET_TYPE.FUNCTION,
				target_name: 'configuration-executer',
				job_name: Date.now(),
				jobpool_name: CatalystJobConstants.PAYLOAD_PROCESSING_JOBPOOL,
				params: {
					domain,
					configuration_id
				}
			}
		});
	}

	/**
	 * @static
	 * @param {CatalystApp} catalystApp
	 * @returns {CatalystJobService}
	 */
	static getInstance(catalystApp) {
		return new CatalystJobService(catalystApp);
	}
}

module.exports = CatalystJobService;
