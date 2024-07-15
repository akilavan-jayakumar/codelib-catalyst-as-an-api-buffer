const axios = require('axios');
const { CatalystApp } = require('zcatalyst-sdk-node/lib/catalyst-app');

const Payload = require('../pojos/Payload');
const PayloadConstants = require('../constants/PayloadConstants');
const PayloadAssetService = require('../services/PayloadAssetService');
const PayloadRequestExecutionStatus = require('../enums/PayloadRequestExecutionStatus');

class PayloadHandler {
	/**
	 *
	 * @private
	 * @type {string}
	 */
	#body;
	/**
	 *
	 * @private
	 * @type {Payload}
	 */
	#payload;
	/**
	 *
	 * @private
	 * @type {string}
	 */
	#baseUrl;
	/**
	 *
	 * @private
	 * @type {Record<string,string>}
	 */
	#headers;
	/**
	 *
	 * @private
	 * @type {CatalystApp}
	 */
	#catalystApp;

	/**
	 *
	 * @param {string} baseUrl
	 * @param {Payload} payload
	 * @param {CatalystApp} catalystApp
	 * @param {Record<string,string>} headers
	 */
	constructor(baseUrl, payload, headers, catalystApp) {
		this.#baseUrl = baseUrl;
		this.#payload = payload;
		this.#headers = headers;
		this.#catalystApp = catalystApp;
	}

	/**
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async preHandlePayload() {
		if (
			this.#payload.getRequestContentType() &&
			this.#payload.getRequestContentType().length &&
			this.#payload.getRequestBodyFileId()
		) {
			await PayloadAssetService.getInstance(this.#catalystApp, this.#payload)
				.getAssetAsText(this.#payload.getRequestBodyFileId())
				.then((body) => {
					this.#body = body;
					this.#headers[PayloadConstants.HEADER_KEYS.CONTENT_TYPE] =
						this.#payload.getRequestContentType();
				});
		}
	}

	/**
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async handlePayload() {
		await axios({
			headers: this.#headers,
			method: this.#payload.getRequestMethod(),
			url: this.#baseUrl + this.#payload.getRequestFullPath(),
			...(this.#body ? { data: this.#body } : {})
		})
			.then((response) => {
				const { status, data } = response;
				this.#payload.setResponseInfo(JSON.stringify({ data }));
				this.#payload.setRequestExecutionStatus(
					PayloadRequestExecutionStatus.success
				);
				this.#payload.setResponseStatusCode(status);
			})
			.catch((err) => {
				const {
					response: { status, data }
				} = err;

				this.#payload.setResponseInfo(JSON.stringify({ data }));
				this.#payload.setResponseStatusCode(status);
				this.#payload.setRequestExecutionStatus(
					PayloadRequestExecutionStatus.failure
				);
			})
			.finally(() => {
				this.#payload.setRetryCount(this.#payload.getRetryCount() + 1);
			});
	}

	/**
	 *
	 * @param {string} baseUrl
	 * @param {Payload} payload
	 * @param {CatalystApp} catalystApp
	 * @param {Record<string,string>} headers
	 * @returns {PayloadHandler}
	 */
	static getInstance(baseUrl, payload, headers, catalystApp) {
		return new PayloadHandler(baseUrl, payload, headers, catalystApp);
	}
}

module.exports = PayloadHandler;
