const axios = require('axios');
const catalyst = require('zcatalyst-sdk-node');

const PayloadUtil = require('./utils/PayloadUtil');
const PayloadService = require('./services/PayloadService');
const ConfigurationUtil = require('./utils/ConfigurationUtil');
const CatalystJobService = require('./services/CatalystJobService');
const PayloadRequestMethod = require('./enums/PayloadRequestMethod');
const PayloadAssetService = require('./services/PayloadAssetService');
const ConfigurationService = require('./services/ConfigurationService');
const PayloadRequestContentType = require('./enums/PayloadRequestContentType');
const CatalystDatastoreConstants = require('./constants/CatalystDatastoreConstants');
const PayloadRequestExecutionStatus = require('./enums/PayloadRequestExecutionStatus');

module.exports = async (jobRequest, context) => {
	try {
		const catalystApp = catalyst.initialize(context);

		const { domain, configuration_id } = jobRequest.getAllJobParams();

		if (!domain || !domain.length) {
			throw new Error('domain cannot be empty.');
		}

		if (!configuration_id || !configuration_id.length) {
			throw new Error('configuration_id cannot be empty.');
		}

		const payloadService = PayloadService.getInstance(catalystApp);

		const configuration = await ConfigurationService.getInstance(
			catalystApp
		).getConfigurationById(configuration_id);

		if (!configuration) {
			throw new Error('No configuration found for id ::: ', configuration_id);
		}

		const payload_request_execution_statuses = [
			PayloadRequestExecutionStatus.pending,
			PayloadRequestExecutionStatus.failure
		];

		const totalRecords = await payloadService
			.getTotalPayloads(
				[],
				[configuration_id],
				configuration.getMaxRetries(),
				payload_request_execution_statuses
			)
			.then((totalRecords) =>
				Math.min(totalRecords, configuration.getThrottleLimit())
			);

		if (totalRecords) {
			const payloads = [];
			let baseHeaders = {};

			if (configuration.getHeadersEndpoint().length) {
				await ConfigurationUtil.getHeaders(
					domain,
					configuration.getHeadersEndpoint()
				).then((headers) => (baseHeaders = headers));
			}

			const totalPages = Math.ceil(
				totalRecords / CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION
			);

			for (let page = 1; page <= totalPages; page++) {
				const offset =
					(page - 1) * CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION + 1;
				await payloadService
					.getPayloadsWithLimit(
						CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION,
						offset,
						[],
						[configuration_id],
						configuration.getMaxRetries(),
						payload_request_execution_statuses
					)
					.then((records) => payloads.push(...records));
			}

			const totalConcurrentRequests = Math.ceil(
				payloads.length / configuration.getConcurrencyLimit()
			);

			for (
				let concurrentRequestNo = 1;
				concurrentRequestNo <= totalConcurrentRequests;
				concurrentRequestNo += configuration.getConcurrencyLimit()
			) {
				const promises = [];
				const requestConfigurations = [];

				const start = concurrentRequestNo - 1;
				const end = Math.min(
					start + configuration.getConcurrencyLimit(),
					payloads.length
				);

				const payloadsToBeProcessed = payloads.slice(start, end);

				for (const payload of payloadsToBeProcessed) {
					const requestConfiguration = {
						headers: baseHeaders,
						method: PayloadRequestMethod[payload.getRequestMethod()],
						url: configuration.getBaseUrl() + payload.getRequestFullPath()
					};

					const payloadAssetService = PayloadAssetService.getInstance(
						catalystApp,
						payload
					);

					const fileName = PayloadUtil.getPayloadFileName(
						payload.getRequestContentType()
					);

					if (
						payload.getRequestContentType() ===
						PayloadRequestContentType.APPLICATION_JSON
					) {
						await payloadAssetService.getAssetAsJson(fileName).then((data) => {
							requestConfiguration['headers'] = {
								...requestConfiguration['headers'],
								'Content-Type':
									PayloadRequestContentType[payload.getRequestContentType()]
							};
							requestConfiguration['data'] = data;
						});
					} else {
						await payloadAssetService.getAssetAsText(fileName).then((data) => {
							requestConfiguration['headers'] = {
								...requestConfiguration['headers'],
								'Content-Type':
									PayloadRequestContentType[payload.getRequestContentType()]
							};
							requestConfiguration['data'] = data;
						});
					}

					requestConfigurations.push(requestConfiguration);
				}

				for (let i = 0; i < payloadsToBeProcessed.length; i++) {
					promises.push(
						axios(requestConfigurations[i])
							.then((response) => {
								const { status } = response;
								payloadsToBeProcessed[i].setRequestExecutionStatus(
									PayloadRequestExecutionStatus.success
								);
								payloadsToBeProcessed[i].setResponseStatusCode(status);
							})
							.catch((err) => {
								const {
									response: { status }
								} = err;

								payloadsToBeProcessed[i].setResponseStatusCode(status);
								payloadsToBeProcessed[i].setRequestExecutionStatus(
									PayloadRequestExecutionStatus.failure
								);
							})
					);
				}

				await Promise.all(promises);
			}

			for (let page = 1; page <= totalPages; page++) {
				const start =
					(page - 1) * CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION;
				const end = Math.min(
					start + CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION,
					payloads.length
				);

				await payloadService.updatePayloads(payloads.slice(start, end));
			}

			console.log('Total payloads processed ::: ', totalRecords);
		} else {
			console.log('No payloads to process');
		}

		await CatalystJobService.getInstance(
			catalystApp
		).executeConfigurationExecutorJob(
			domain,
			configuration_id,
			configuration.getThrottleWindowTime()
		);

		context.closeWithSuccess();
	} catch (err) {
		console.log('Error ::: ', err);
		context.closeWithFailure();
	}
};
