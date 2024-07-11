const { Request } = require('express');

const RequestMethod = require('../enums/RequestMethod');
const RequestConstants = require('../constants/RequestConstants');

class RequestUtil {
	/**
	 * @static
	 * @param {Request} request
	 * @return {string|null}
	 */
	static getContentType(request) {
		const method = request.method;
		if (
			method !== RequestMethod.GET ||
			method !== RequestMethod.HEAD ||
			method !== RequestMethod.OPTIONS ||
			!request.headers[RequestConstants.HeaderKeys.CONTENT_TYPE]
		) {
			return null;
		}

		return request.headers[RequestConstants.HeaderKeys.CONTENT_TYPE];
	}

	/**
	 * @static
	 * @param {Request} request
	 * @return {string|null}
	 */
	static getCodeLibSecretKey(request) {
		return request.headers[
			RequestConstants.HeaderKeys.CATALYST_CODELIB_SECRET_KEY
		];
	}
}

module.exports = RequestUtil;
