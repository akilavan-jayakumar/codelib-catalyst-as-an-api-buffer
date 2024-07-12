const RequestConstants = {
	MAX_ENTITY_SIZE: 30 * 1000 * 1000, //Maximum allowed size is 30MB
	HEADER_KEYS: {
		CONTENT_TYPE: 'content-type',
		CATALYST_CODELIB_SECRET_KEY: 'catalyst-codelib-secret-key'
	}
};

module.exports = RequestConstants;
