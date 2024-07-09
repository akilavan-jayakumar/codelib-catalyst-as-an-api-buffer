const Payload = require('../pojos/Payload');

class PayloadService {
	#catalystApp;
	constructor(catalystApp) {
		this.#catalystApp = catalystApp;
	}

	#createPayloadsFromQueryResults(results) {
		return results.map((result) => {
			const payload = new Payload();
			payload.loadFromQueryResult(result);
			return payload;
		});
	}

	#generateCriteria(
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

		return criteria.join(' AND ');
	}

	getTotalPayloads(
		rowIds,
		configurationIds,
		payload_max_retry_count,
		payload_request_execution_statuses
	) {
		const criteria = this.#generateCriteria(
			rowIds,
			configurationIds,
			payload_max_retry_count,
			payload_request_execution_statuses
		);

		console.log(`SELECT COUNT(Payload.ROWID) FROM Payload WHERE ${criteria}`);

		return this.#catalystApp
			.zcql()
			.executeZCQLQuery(
				`SELECT COUNT(Payload.ROWID) FROM Payload WHERE ${criteria}`
			)
			.then((results) => parseInt(results[0]['Payload'][`COUNT(ROWID)`]));
	}

	getPayloadsWithLimit(
		limit,
		offset,
		rowIds,
		configurationIds,
		payload_max_retry_count,
		payload_request_execution_statuses
	) {
		const criteria = this.#generateCriteria(
			rowIds,
			configurationIds,
			payload_max_retry_count,
			payload_request_execution_statuses
		);
		
		return this.#catalystApp
			.zcql()
			.executeZCQLQuery(
				`SELECT * FROM Payload WHERE ${criteria} ORDER BY CREATEDTIME ASC OFFSET ${offset} LIMIT ${limit}`
			)
			.then(this.#createPayloadsFromQueryResults);
	}

	async updatePayloads(payloads) {
		await this.#catalystApp
			.datastore()
			.table('Payload')
			.updateRows(payloads.map((payload) => payload.getUpdatePayload()));
	}

	static getInstance(catalystApp) {
		return new PayloadService(catalystApp);
	}
}

module.exports = PayloadService;
