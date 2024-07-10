const catalyst = require('zcatalyst-sdk-node');

const PayloadService = require('./services/PayloadService');
const PayloadConstants = require('./constants/PayloadConstants');
const PayloadAssetService = require('./services/PayloadAssetService');
const CatalystDatastoreConstants = require('./constants/CatalystDatastoreConstants');
const PayloadRequestExecutionStatus = require('./enums/PayloadRequestExecutionStatus');

module.exports = async (_, context) => {
	try {
		const catalystApp = catalyst.initialize(context);

		const payloadService = PayloadService.getInstance(catalystApp);

		const payload_request_execution_statuses = [
			PayloadRequestExecutionStatus.success
		];
		const totalRecords = await payloadService
			.getTotalPayloads([], [], undefined, payload_request_execution_statuses)
			.then((totalRecords) =>
				Math.min(
					totalRecords,
					PayloadConstants.MAX_PAYLOADS_DELETED_PER_EXECUTION
				)
			);

		if (totalRecords) {
			const totalPages = Math.ceil(
				totalRecords / CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION
			);

			for (let page = 1; page <= totalPages; page++) {
				const offset =
					(page - 1) * CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION + 1;

				const payloads = await payloadService.getPayloadsWithLimit(
					CatalystDatastoreConstants.MAX_RECORDS_PER_OPERATION,
					offset,
					[],
					[],
					undefined,
					payload_request_execution_statuses
				);

				for (const payload of payloads) {
					await PayloadAssetService.getInstance(
						catalystApp,
						payload
					).flushAssets();
				}

				await payloadService.deletePayloads(
					payloads.map((payload) => payload.getRowId())
				);
			}
		}
		context.closeWithSuccess();
	} catch (err) {
		console.log('Error ::: ', err);
		context.closeWithFailure();
	}
};
