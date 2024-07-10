class QueryUtil {
	/**
	 *
     * @static
	 * @param {string} value
	 * @returns {string}
	 */
	static toQueryString(value) {
		return value.replace(/'/g, "''");
	}
}

module.exports = QueryUtil;
