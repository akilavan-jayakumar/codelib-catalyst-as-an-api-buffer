const express = require('express');
const rawBody = require('raw-body');
const catalyst = require('zcatalyst-sdk-node');

const Payload = require('./pojos/Payload');
const AuthUtil = require('./utils/AuthUtil');
const AppError = require('./errors/AppError');
const CommonUtil = require('./utils/CommonUtil');
const RequestUtil = require('./utils/RequestUtil');
const PayloadUtil = require('./utils/PayloadUtil');
const ResponseType = require('./enums/ResponseType');
const DiskService = require('./services/DiskService');
const RequestMethod = require('./enums/RequestMethod');
const ErrorHandler = require('./handlers/ErrorHandler');
const EnvConstants = require('./constants/EnvConstants');
const ResponseWrapper = require('./web/ResponseWrapper');
const PayloadService = require('./services/PayloadService');
const ResponseHandler = require('./handlers/ResponseHandler');
const PayloadConstants = require('./constants/PayloadConstants');
const ResponseStatusCode = require('./enums/ResponseStatusCode');
const PayloadValidation = require('./validations/PayloadValidation');
const PayloadAssetService = require('./services/PayloadAssetService');
const ConfigurationService = require('./services/ConfigurationService');
const PayloadRequestExecutionStatus = require('./enums/PayloadRequestExecutionStatus');

const app = express();

app.use((request, _response, next) => {
	try {
		const codeLibSecretKey = RequestUtil.getCodeLibSecretKey(request);

		if (!AuthUtil.isValidCodeLibSecretKey(codeLibSecretKey)) {
			throw new AppError(
				ResponseStatusCode.UNAUTHORIZED,
				"You don't have permission to perform this operation. Kindly contact your administrator for more details."
			);
		}
		next();
	} catch (err) {
		next(err);
	}
});

app.use(async (request, response, next) => {
	try {
		const catalystApp = catalyst.initialize(request);
		response.locals.catalystApp = catalystApp;
		request.rawBody = await rawBody(request);
		next();
	} catch (err) {
		next(err);
	}
});

app.all('/:configuration_id/*', async (request, response, next) => {
	try {
		PayloadValidation.validateCreatePayload(request);

		let configuration = null;

		const catalystApp = response.locals.catalystApp;

		const configuration_id = request.params.configuration_id;

		const method = request.method;
		const rawBody = request.rawBody;
		const contentType = RequestUtil.getContentType(request);

		if (CommonUtil.isNumber(configuration_id)) {
			configuration = await ConfigurationService.getInstance(
				catalystApp
			).getConfigurationById(configuration_id);
		} else {
			configuration = await ConfigurationService.getInstance(
				catalystApp
			).getConfigurationByName(configuration_id);
		}

		if (!configuration) {
			throw new AppError(
				ResponseStatusCode.NOT_FOUND,
				"We couldn't find the requested configuration on the server."
			);
		}

		const payload = new Payload();

		payload.setResponseInfo(null);
		payload.setRequestBodyFileId('');
		payload.setRequestMethod(method);
		payload.setResponseStatusCode(null);
		payload.setRequestContentType(contentType);
		payload.setRequestFullPath(request.originalUrl);
		payload.setConfigurationId(configuration.getRowId());
		payload.setRetryCount(PayloadConstants.MAX_RETRY_BASE_VALUE);
		payload.setRequestExecutionStatus(PayloadRequestExecutionStatus.pending);

		const payloadService = PayloadService.getInstance(catalystApp);
		await payloadService.createPayload(payload);

		if (
			method !== RequestMethod.GET ||
			method !== RequestMethod.HEAD ||
			method !== RequestMethod.OPTIONS
		) {
			const diskService = new DiskService();
			const payloadFileName = PayloadUtil.getPayloadFileName(
				payload.getRowId()
			);

			const payloadAssetService = PayloadAssetService.getInstance(
				catalystApp,
				payload
			);

			await diskService.writeFile(payloadFileName, rawBody);
			const readStream = await diskService.readFileAsStream(payloadFileName);

			await payloadAssetService
				.uploadAsset(payloadFileName, readStream)
				.then((fileId) => payload.setRequestBodyFileId(fileId));
			await payloadService.updatePayload(payload);
		}

		const responseWrapper = new ResponseWrapper(ResponseType.APPLICATION_JSON);
		responseWrapper.setData(payload.getResponseJson());
		responseWrapper.setStatusCode(ResponseStatusCode.OK);

		ResponseHandler.sendResponse(response, responseWrapper);
	} catch (err) {
		next(err);
	}
});

app.use((error, _request, response, _next) => {
	const { message, statusCode } = ErrorHandler.processError(error);

	const responseWrapper = new ResponseWrapper(ResponseType.APPLICATION_JSON);
	responseWrapper.setMessage(message);
	responseWrapper.setStatusCode(statusCode);

	ResponseHandler.sendResponse(response, responseWrapper);
});

app.listen(EnvConstants.PORT, () => {
	console.log('Server started on port', EnvConstants.PORT);
});
