class RequestUtil {
	/**
	 * @static
	 * @return {string}
	 */
	static getDomain(request) {
		let domain = request.get('host');

		if (domain.includes(':')) {
			domain = domain.substring(0, domain.indexOf(':'));
		}
		return 'https://' + domain;
	}
}

module.exports = RequestUtil;
