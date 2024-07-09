const axios = require('axios').default;

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
			.get(domain + ConfigurationConstants.BASE_ENDPOINT + endpoint)
			.then((response) => response.data.data);
	}
}

module.exports = ConfigurationUtil;
