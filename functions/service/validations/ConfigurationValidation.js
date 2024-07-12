const { Request } = require('express');

const AppError = require('../errors/AppError');
const AjvInstance = require('../instances/AjvInstance');
const ResponseStatusCode = require('../enums/ResponseStatusCode');
const ConfigurationConstants = require('../constants/ConfigurationConstants');

class ConfigurationValidation {
	static #CONFIGURATION_NAME_PATTERN = '^[0-9A-Za-z_-]+$';

	/**
	 *
	 * @param {Request} request
	 * @returns {void}
	 */
	static validateGetConfiguration(request) {
		const configuration_id = request.params.configuration_id;

		const schema = {
			type: 'string',
			pattern: this.#CONFIGURATION_NAME_PATTERN,
			errorMessage: {
				pattern:
					'Invalid value for configuration identifier. Configuration identifier should contain only alphanumeric characters, underscores and hyphens.'
			}
		};

		const validate = AjvInstance.compile(schema);

		const isValid = validate(configuration_id);

		if (!isValid) {
			const { errors } = validate;

			if (errors && errors.length) {
				throw new AppError(ResponseStatusCode.BAD_REQUEST, errors[0].message);
			}
		}
	}

	/**
	 *
	 * @param {Request} request
	 * @returns {void}
	 */
	static validateCreateConfiguration(request) {
		const schema = {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					minLength: 1,
					pattern: this.#CONFIGURATION_NAME_PATTERN,
					errorMessage: {
						minLength: 'name cannot be empty.',
						pattern:
							'Invalid value for name. name should contain only alphanumeric characters, underscores and hyphens.'
					}
				},
				base_url: {
					type: 'string',
					minLength: 1,
					format: 'uri',
					errorMessage: {
						minLength: 'base_url cannot be empty.',
						pattern: 'Invalid value for base_url. base_url should be a url.'
					}
				},
				max_retries: {
					type: 'number',
					minimum: 0,
					maximum: 10,
					errorMessage: {
						type: 'Invalid value for max_retries. max_retries should be a number',
						minimum: 'max_retries should be greater than or equal to 0.',
						maximum: 'max_retries should be less than or equal to 10.'
					}
				},
				throttle_limit: {
					type: 'number',
					minimum: ConfigurationConstants.DEFAULT_CONCURRENCY_LIMIT,
					errorMessage: {
						type: 'Invalid value for throttle_limit. throttle_limit should be a number',
						minimum: 'throttle_limit should be greater than or equal to 1.'
					}
				},
				throttle_window_time: {
					type: 'number',
					minimum: 10,
					errorMessage: {
						type: 'Invalid value for throttle_window_time. throttle_window_time should be a number',
						minimum:
							'throttle_window_time should be greater than or equal to 10.'
					}
				},
				headers_endpoint: {
					type: 'string'
				}
			},
			required: [
				'name',
				'base_url',
				'max_retries',
				'throttle_limit',
				'throttle_window_time'
			],
			errorMessage: {
				required: {
					name: 'name cannot be empty.',
					base_url: 'base_url cannot be empty.',
					max_retries: 'max_retries cannot be empty.',
					throttle_limit: 'throttle_limit cannot be empty.',
					throttle_window_time: 'throttle_window_time cannot be empty.'
				}
			}
		};

		const validate = AjvInstance.compile(schema);

		const isValid = validate(request.body);

		if (!isValid) {
			const { errors } = validate;

			if (errors && errors.length) {
				throw new AppError(ResponseStatusCode.BAD_REQUEST, errors[0].message);
			}
		}
	}
}

module.exports = ConfigurationValidation;
