const EnvConstants = require('../constants/EnvConstants');
const AuthConstants = require('../constants/AuthConstants');

class AuthUtil {
	/**
	 *
	 * @static
	 * @param {string} key
	 * @returns {boolean}
	 */
	static isValidCodeLibSecretKey(key) {
		return (
			key &&
			key !== AuthConstants.CODELIB_SECRET_KEY_DEFAULT_VALUE &&
			key === EnvConstants.CODELIB_SECRET_KEY
		);
	}
}

module.exports = AuthUtil