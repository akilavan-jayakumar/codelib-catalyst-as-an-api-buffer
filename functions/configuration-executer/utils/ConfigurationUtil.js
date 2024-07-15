const axios = require('axios').default;

const EnvConstants = require('../constants/EnvConstants');
const ConfigurationConstants = require('../constants/ConfigurationConstants');

class ConfigurationUtil {
	/**
	 * @async
	 * @param {string} domain
	 * @param {string} endpoint
	 * @returns {Promise<Record<string,string>>}
	 */
	static async getHeaders(domain, endpoint) {
		return axios
			.get(domain + ConfigurationConstants.HEADERS_BASE_ENDPOINT + endpoint, {
				headers: {
					[ConfigurationConstants.HEADERS_RETRIEVING_HEADER_KEYS
						.CATALYST_CODELIB_SECRET_KEY]: EnvConstants.CODELIB_SECRET_KEY
				}
			})
			.then((response) => {
				const headers = {};
				const result = response.data.data;

				for (const [key, value] of Object.entries(result)) {
					for (const header of ConfigurationConstants.RETRIEVED_HEADERS_RESTRICTED_HEADERS_KEYS) {
						if (key.toLowerCase() !== header.toLowerCase()) {
							headers[key] = value;
						}
					}
				}

				return headers;
			});
	}
}

module.exports = ConfigurationUtil;
