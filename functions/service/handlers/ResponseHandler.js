const ResponseType = require('../enums/ResponseType');
const ResponseWrapper = require('../web/ResponseWrapper');

class ResponseHandler {
	/**
	 * @param {any} response
	 * @param {ResponseWrapper} responseWrapper
	 * @returns {void}
	 */
	static sendResponse(response, responseWrapper) {
		if (responseWrapper.getResponseType() === ResponseType.APPLICATION_JSON) {
			response
				.status(responseWrapper.getStatusCode())
				.json(responseWrapper.getResponseJson());
		}
	}
}

module.exports = ResponseHandler;
