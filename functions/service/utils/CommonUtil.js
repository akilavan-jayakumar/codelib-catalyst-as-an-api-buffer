class CommonUtil {
	/**
	 *
	 * @param {string} value
	 * @returns {boolean}
	 */
	static isNumber(value) {
		return /^[0-9]+$/.test(value);
	}
}

module.exports = CommonUtil;
