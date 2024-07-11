const { Request } = require('express');

const AppError = require('../errors/AppError');
const ResponseStatusCode = require('../enums/ResponseStatusCode');

class PayloadValidation {
	static #CONFIGURATION_NAME_PATTERN = /^[0-9A-Za-z_-]+$/;

	/**
	 *
	 * @param {Request} request
	 * @returns {void}
	 */
	static validateCreatePayload(request) {
		const configuration_id = request.params.configuration_id;

		if (!this.#CONFIGURATION_NAME_PATTERN.test(configuration_id)) {
			throw new AppError(
				ResponseStatusCode.BAD_REQUEST,
				'Invalid value for configuration identifier. Configuration identifier should contain only alphanumeric characters, underscores and hyphens.'
			);
		}
	}
}

module.exports = PayloadValidation;
