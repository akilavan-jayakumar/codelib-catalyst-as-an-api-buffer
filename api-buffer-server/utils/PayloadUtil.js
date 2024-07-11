const PayloadConstants = require('../constants/PayloadConstants');

class PayloadUtil {
	
    /**
	 *
     * @static
	 * @param {string} payload_id
	 * @returns {string}
	 */
	static getPayloadFileName(payload_id) {
		return payload_id + '-' + PayloadConstants.PAYLOAD_FILENAME;
	}
}

module.exports = PayloadUtil;
