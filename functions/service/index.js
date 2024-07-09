const express = require('express');
const catalyst = require('zcatalyst-sdk-node');

const RequestUtil = require('./utils/RequestUtil');
const ResponseType = require('./enums/ResponseType');
const Configuration = require('./pojos/Configuration');
const ErrorHandler = require('./handlers/ErrorHandler');
const ResponseWrapper = require('./web/ResponseWrapper');
const ResponseHandler = require('./handlers/ResponseHandler');
const ResponseStatusCode = require('./enums/ResponseStatusCode');
const CatalystJobService = require('./services/CatalystJobService');
const ConfigurationService = require('./services/ConfigurationService');
const ConfigurationConstants = require('./constants/ConfigurationConstants');

const app = express();
app.use(express.json());

app.use((request, response, next) => {
	const catalystApp = catalyst.initialize(request);
	response.locals.catalystApp = catalystApp;
	next();
});

app.post('/configuration', async (request, response, next) => {
	try {
		const catalystApp = response.locals.catalystApp;

		const domain = RequestUtil.getDomain(request);

		const responseWrapper = new ResponseWrapper(ResponseType.APPLICATION_JSON);

		const {
			name,
			base_url,
			max_retries,
			throttle_limit,
			headers_endpoint = '',
			throttle_window_time
		} = request.body;

		const configurationService = ConfigurationService.getInstance(catalystApp);

		const configuration = new Configuration();
		configuration.setName(name);
		configuration.setBaseUrl(base_url);
		configuration.setMaxRetries(max_retries);
		configuration.setThrottleLimit(throttle_limit);
		configuration.setHeadersEndpoint(headers_endpoint);
		configuration.setThrottleWindowTime(throttle_window_time);
		configuration.setConcurrencyLimit(
			ConfigurationConstants.DEFAULT_CONCURRENCY_LIMIT
		);

		await configurationService.createConfiguration(configuration);
		await CatalystJobService.getInstance(
			catalystApp
		).executeConfigurationExecutorJob(domain, configuration.getRowId(), 0);

		responseWrapper.setStatusCode(ResponseStatusCode.OK);
		responseWrapper.setData(configuration.getResponseJson());

		ResponseHandler.sendResponse(response, responseWrapper);
	} catch (err) {
		next(err);
	}
});

app.get('/headers/sample', async (_request, response, next) => {
	try {
		const headers = {};

		const responseWrapper = new ResponseWrapper(ResponseType.APPLICATION_JSON);
		responseWrapper.setData(headers);
		responseWrapper.setStatusCode(statusCode);

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

module.exports = app;
