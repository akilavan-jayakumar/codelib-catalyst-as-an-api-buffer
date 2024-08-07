const { AxiosError } = require('axios');
const catalyst = require('zcatalyst-sdk-node');

const PayloadService = require('./services/PayloadService');
const PayloadHandler = require('./handlers/PayloadHandler');
const ConfigurationUtil = require('./utils/ConfigurationUtil');
const CatalystJobService = require('./services/CatalystJobService');
const ConfigurationService = require('./services/ConfigurationService');
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

			if (configuration.getHeadersEndpoint()?.length) {
				await ConfigurationUtil.getHeaders(
					domain,
					configuration.getHeadersEndpoint()
				).then((headers) => {
					baseHeaders = headers;
				});
			}

			const limit = Math.min(
				totalRecords,
				CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION
			);
			const totalPages = Math.ceil(totalRecords / limit);

			for (let page = 1; page <= totalPages; page++) {
				const offset = (page - 1) * limit + 1;
				await payloadService
					.getPayloadsWithLimit(
						limit,
						offset,
						[],
						[configuration_id],
						configuration.getMaxRetries(),
						payload_request_execution_statuses
					)
					.then((records) => payloads.push(...records));
			}

			const concurrencyLimit = configuration.getConcurrencyLimit();

			const totalConcurrentRequests = Math.ceil(
				payloads.length / concurrencyLimit
			);

			for (
				let concurrentRequestNo = 1;
				concurrentRequestNo <= totalConcurrentRequests;
				concurrentRequestNo++
			) {
				const promises = [];

				const start = (concurrentRequestNo - 1) * concurrencyLimit;
				const end = Math.min(start + concurrencyLimit, payloads.length);

				const payloadsToBeProcessed = payloads.slice(start, end);

				for (const payload of payloadsToBeProcessed) {
					const payloadHandler = PayloadHandler.getInstance(
						configuration.getBaseUrl(),
						payload,
						baseHeaders,
						catalystApp
					);
					await payloadHandler.preHandlePayload();
					promises.push(payloadHandler.handlePayload());
				}

				await Promise.all(promises);
			}

			for (let page = 1; page <= totalPages; page++) {
				const start = (page - 1) * limit;
				const end = Math.min(start + limit, payloads.length);

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
		if (err instanceof AxiosError) {
			const {
				response: {
					data,
					status,
					config: { url }
				}
			} = err;
			console.log(
				'Error ::: ',
				JSON.stringify(
					{
						url,
						data,
						status
					},
					null,
					4
				)
			);
		} else {
			console.log('Error :::', err);
		}
		context.closeWithFailure();
	}
};
