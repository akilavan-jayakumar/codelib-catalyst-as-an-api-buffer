const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');

const QueryUtil = require('../utils/QueryUtil');
const Configuration = require('../pojos/Configuration');

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
	 *
	 * @param {Array<Record<string,unknown>>} results
	 * @returns {Array<Configuration>}
	 */
	#createConfigurationsFromQueryResults(results) {
		return results.map((result) => {
			const configuration = new Configuration();
			configuration.loadFromQueryResult(result);
			return configuration;
		});
	}

	/**
	 *
	 * @param {string} name
	 * @param {Array<string>} rowIds
	 * @returns {string}
	 */
	#generateWhereCriteria(name, rowIds) {
		const criteria = [];

		if (name.length) {
			criteria.push(
				`Configuration.NAME LIKE '${QueryUtil.toQueryString(name)}'`
			);
		}

		if (rowIds && rowIds.length) {
			criteria.push(
				`Configuration.ROWID IN (${rowIds
					.map((item) => `'${item}'`)
					.join(',')})`
			);
		}

		if (criteria.length) {
			return `WHERE ${criteria.join(' AND ')}`;
		} else {
			return '';
		}
	}

	/**
	 *
	 * @async
	 * @param {number} limit
	 * @param {number} offset
	 * @param {string} name
	 * @param {Array<string>} rowIds
	 * @returns {Promise<Array<Configuration>>}
	 */
	async getConfigurationsWithLimit(limit, offset, name, rowIds) {
		const whereCriteria = this.#generateWhereCriteria(name, rowIds);
		return this.#catalystApp
			.zcql()
			.executeZCQLQuery(
				`SELECT * FROM Configuration ${whereCriteria} ORDER BY Configuration.CREATEDTIME OFFSET ${offset} LIMIT ${limit}`
			)
			.then(this.#createConfigurationsFromQueryResults);
	}

	/**
	 *
	 * @async
	 * @param {string} configuration_id
	 * @returns {Promise<Configuration|null>}
	 */
	async getConfigurationById(configuration_id) {
		return this.getConfigurationsWithLimit(1, 1, '', [configuration_id]).then(
			(configurations) => {
				if (configurations.length) {
					return configurations[0];
				} else {
					return null;
				}
			}
		);
	}

	/**
	 *
	 * @async
	 * @param {string} name
	 * @returns {Promise<Configuration|null>}
	 */
	async getConfigurationByName(name) {
		return this.getConfigurationsWithLimit(1, 1, name, []).then(
			(configurations) => {
				if (configurations.length) {
					return configurations[0];
				} else {
					return null;
				}
			}
		);
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
