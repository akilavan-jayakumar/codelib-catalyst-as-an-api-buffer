const { Request } = require('express');

const RequestMethod = require('../enums/RequestMethod');
const RequestConstants = require('../constants/RequestConstants');

class RequestUtil {
	/**
	 * @static
	 * @param {Request} request
	 * @return {boolean}
	 */
	static isValidRequestToReadBodyContent(request) {
		const method = request.method;
		return (
			method !== RequestMethod.GET &&
			method !== RequestMethod.HEAD &&
			method !== RequestMethod.OPTIONS &&
			request.headers[RequestConstants.HEADER_KEYS.CONTENT_TYPE]
		);
	}

	/**
	 * @static
	 * @param {Request} request
	 * @return {string|null}
	 */
	static getContentType(request) {
		if (this.isValidRequestToReadBodyContent(request)) {
			return request.headers[RequestConstants.HEADER_KEYS.CONTENT_TYPE];
		}

		return null;
	}

	/**
	 * @static
	 * @param {Request} request
	 * @return {string|null}
	 */
	static getCodeLibSecretKey(request) {
		return request.headers[
			RequestConstants.HEADER_KEYS.CATALYST_CODELIB_SECRET_KEY
		];
	}
}

module.exports = RequestUtil;
