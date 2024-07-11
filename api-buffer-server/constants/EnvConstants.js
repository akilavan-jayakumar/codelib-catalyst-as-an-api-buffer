const EnvConstants = {
	CODELIB_SECRET_KEY: process.env['CODELIB_SECRET_KEY'],
	PORT: process.env['X_ZOHO_CATALYST_LISTEN_PORT'] || 3000,
};

module.exports = EnvConstants;