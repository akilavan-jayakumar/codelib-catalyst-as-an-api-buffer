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
	 * @param {Array<Record<string,unknown>>} results
	 * @returns {Array<Payload>}
	 */
	#createPayloadsFromQueryResults(results) {
		return results.map((result) => {
			const payload = new Payload();
			payload.loadFromQueryResult(result);
			return payload;
		});
	}

	/**
	 *
	 * @param {Array<string>} rowIds
	 * @param {Array<string>} configurationIds
	 * @param {number} payload_max_retry_count
	 * @param {Array<number>} payload_request_execution_statuses
	 * @returns
	 */
	#generateWhereCriteria(
		rowIds,
		configurationIds,
		payload_max_retry_count,
		payload_request_execution_statuses
	) {
		const criteria = [];

		if (rowIds && rowIds.length) {
			criteria.push(
				`Payload.ROWID IN (${rowIds.map((item) => `'${item}'`).join(',')})`
			);
		}

		if (configurationIds && configurationIds.length) {
			criteria.push(
				`Payload.CONFIGURATION_ID IN (${configurationIds
					.map((item) => `'${item}'`)
					.join(',')})`
			);
		}

		if (
			payload_max_retry_count != undefined ||
			payload_max_retry_count != null
		) {
			criteria.push(`Payload.RETRY_COUNT < '${payload_max_retry_count}'`);
		}

		if (
			payload_request_execution_statuses &&
			payload_request_execution_statuses.length
		) {
			criteria.push(
				`Payload.REQUEST_EXECUTION_STATUS IN (${payload_request_execution_statuses
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
	 * @param {Array<string>} rowIds
	 * @param {Array<string>} configurationIds
	 * @param {number} payload_max_retry_count
	 * @param {Array<number>} payload_request_execution_statuses
	 * @returns {Promise<number>}
	 */
	async getTotalPayloads(
		rowIds,
		configurationIds,
		payload_max_retry_count,
		payload_request_execution_statuses
	) {
		const whereCriteria = this.#generateWhereCriteria(
			rowIds,
			configurationIds,
			payload_max_retry_count,
			payload_request_execution_statuses
		);

		return this.#catalystApp
			.zcql()
			.executeZCQLQuery(
				`SELECT COUNT(Payload.ROWID) FROM Payload ${whereCriteria}`
			)
			.then((results) => parseInt(results[0]['Payload'][`COUNT(ROWID)`]));
	}

	/**
	 *
	 * @async
	 * @param {number} limit
	 * @param {number} offset
	 * @param {Array<string>} rowIds
	 * @param {Array<string>} configurationIds
	 * @param {number} payload_max_retry_count
	 * @param {Array<number>} payload_request_execution_statuses
	 * @returns {Promise<Array<Payload>>}
	 */
	async getPayloadsWithLimit(
		limit,
		offset,
		rowIds,
		configurationIds,
		payload_max_retry_count,
		payload_request_execution_statuses
	) {
		const whereCriteria = this.#generateWhereCriteria(
			rowIds,
			configurationIds,
			payload_max_retry_count,
			payload_request_execution_statuses
		);

		return this.#catalystApp
			.zcql()
			.executeZCQLQuery(
				`SELECT * FROM Payload ${whereCriteria} ORDER BY CREATEDTIME ASC OFFSET ${offset} LIMIT ${limit}`
			)
			.then(this.#createPayloadsFromQueryResults);
	}

	/**
	 *
	 * @param {Array<string>} rowIds
	 * @returns {Promise<void>}
	 */
	async deletePayloads(rowIds) {
		const whereCriteria = this.#generateWhereCriteria(rowIds, [], null, []);

		await this.#catalystApp
			.zcql()
			.executeZCQLQuery(`DELETE FROM Payload ${whereCriteria}`);
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
