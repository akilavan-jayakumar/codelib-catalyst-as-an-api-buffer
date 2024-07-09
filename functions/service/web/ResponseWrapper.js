class ResponseWrapper {
	#page;
	#data;
	#message;
	#statusCode;
	#responseType;

	constructor(responseType) {
		this.#responseType = responseType;
	}

	getPage() {
		return this.#page;
	}

	setPage(value) {
		this.#page = value;
	}

	getData() {
		return this.#data;
	}

	setData(value) {
		this.#data = value;
	}

	/**
	 * @returns {string}
	 */
	getMessage() {
		return this.#message;
	}

	/**
	 * @param {string} value
	 * @returns {void}
	 */
	setMessage(value) {
		this.#message = value;
	}

	/**
	 * @returns {number}
	 */
	getStatusCode() {
		return this.#statusCode;
	}

	/**
	 * @param {number} value
	 * @returns {void}
	 */
	setStatusCode(value) {
		this.#statusCode = value;
	}

	getResponseType() {
		return this.#responseType;
	}

	getResponseJson() {
		const result = {};

		if (this.#data) {
			result['data'] = this.#data;
		}

		if (this.#page) {
			result['page'] = this.#page;
		}

		if (this.#message) {
			result['message'] = this.#message;
		}

		if (this.#statusCode >= 200 && this.#statusCode < 300) {
			result['status'] = 'success';
		} else {
			result['status'] = 'failure';
		}

		return result;
	}
}

module.exports = ResponseWrapper;
