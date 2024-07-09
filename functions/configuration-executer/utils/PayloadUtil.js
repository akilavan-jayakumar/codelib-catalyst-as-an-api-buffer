const FileExtensions = require('../enums/FileExtensions');
const PayloadConstants = require('../constants/PayloadConstants');
const PayloadRequestContentType = require('../enums/PayloadRequestContentType');

class PayloadUtil {
	static getPayloadFileName(contentType) {
		if (contentType === PayloadRequestContentType.APPLICATION_JSON) {
			return (
				PayloadConstants.PAYLOAD_FILENAME_WITHOUT_EXTENSION +
				FileExtensions.JSON
			);
		}else{
            return (
				PayloadConstants.PAYLOAD_FILENAME_WITHOUT_EXTENSION +
				FileExtensions.TEXT
			);
        }
	}
}

module.exports = PayloadUtil;
