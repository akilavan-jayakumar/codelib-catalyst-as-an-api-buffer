const Ajv = require('ajv');
const AjvErrors = require('ajv-errors');
const AjvFormats = require('ajv-formats');
const AjvKeywords = require('ajv-keywords');

const AjvInstance = AjvKeywords(
	AjvFormats(
		AjvErrors(
			new Ajv({
				allErrors: true,
				coerceTypes: true
			})
		)
	)
);

module.exports = AjvInstance;
