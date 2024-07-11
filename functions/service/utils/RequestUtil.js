const { Request } = require('express');

const RequestConstants = require('../constants/RequestConstants');

class RequestUtil {
	/**
	 * @static
	 * @param {Request} request
	 * @return {string}
	 */
	static getDomain(request) {
		let domain = request.headers(RequestConstants.HeaderKeys.HOST);

		if (domain.includes(':')) {
			domain = domain.substring(0, domain.indexOf(':'));
		}
		return 'https://' + domain;
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
