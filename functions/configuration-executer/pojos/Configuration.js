class Configuration {
	#name;
	#rowId;
	#base_url;
	#max_retries;
	#created_time;
	#throttle_limit;
	#headers_endpoint;
	#concurrency_limit;
	#throttle_window_time;

	getName() {
		return this.#name;
	}
	setName(value) {
		this.#name = value;
	}

	getRowId() {
		return this.#rowId;
	}
	setRowId(value) {
		this.#rowId = value;
	}

	getBaseUrl() {
		return this.#base_url;
	}
	setBaseUrl(value) {
		this.#base_url = value;
	}

	getMaxRetries() {
		return this.#max_retries;
	}
	setMaxRetries(value) {
		this.#max_retries = value;
	}

	getCreatedTime() {
		return this.#created_time;
	}
	setCreatedTime(value) {
		this.#created_time = value;
	}

	getThrottleLimit() {
		return this.#throttle_limit;
	}
	setThrottleLimit(value) {
		this.#throttle_limit = value;
	}

	/**
	 * 
	 * @returns {string}
	 */
	getHeadersEndpoint() {
		return this.#headers_endpoint;
	}
	setHeadersEndpoint(value) {
		this.#headers_endpoint = value;
	}

	getConcurrencyLimit() {
		return this.#concurrency_limit;
	}
	setConcurrencyLimit(value) {
		this.#concurrency_limit = value;
	}

	getThrottleWindowTime() {
		return this.#throttle_window_time;
	}
	setThrottleWindowTime(value) {
		this.#throttle_window_time = value;
	}

	loadFromQueryResult(result) {
		const json = result['Configuration'];

		this.#name = json['NAME'];
		this.#rowId = json['ROWID'];
		this.#base_url = json['BASE_URL'];
		this.#created_time = json['CREATEDTIME'];
		this.#headers_endpoint = json['HEADERS_ENDPOINT'];

		this.#max_retries = parseInt(json['MAX_RETRIES']);
		this.#throttle_limit = parseInt(json['THROTTLE_LIMIT']);
		this.#concurrency_limit = parseInt(json['CONCURRENCY_LIMIT']);
		this.#throttle_window_time = parseInt(json['THROTTLE_WINDOW_TIME']);
	}

	loadFromTableResult(result) {
		this.#rowId = result['ROWID'];
		this.#created_time = result['CREATEDTIME'];
	}

	getInsertPayload() {
		return {
			NAME: this.#name,
			BASE_URL: this.#base_url,
			MAX_RETRIES: this.#max_retries,
			THROTTLE_LIMIT: this.#throttle_limit,
			HEADERS_ENDPOINT: this.#headers_endpoint,
			CONCURRENCY_LIMIT: this.#concurrency_limit,
			THROTTLE_WINDOW_TIME: this.#throttle_window_time
		};
	}

	getResponseJson() {
		return {
			id: this.#rowId,
			name: this.#name,
			base_url: this.#base_url,
			max_retries: this.#max_retries,
			created_time: this.#created_time,
			throttle_limit: this.#throttle_limit,
			headers_endpoint: this.#headers_endpoint,
			throttle_window_time: this.#throttle_window_time
		};
	}
}

module.exports = Configuration;
