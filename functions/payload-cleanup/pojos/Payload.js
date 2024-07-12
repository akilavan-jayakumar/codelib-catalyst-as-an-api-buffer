class Payload {
	#rowId;
	#retry_count;
	#created_time;
	#response_info;
	#request_method;
	#configuration_id;
	#request_full_path;
	#request_content_type;
	#request_body_file_id;
	#response_status_code;
	#request_execution_status;

	getRowId() {
		return this.#rowId;
	}
	setRowId(rowId) {
		this.#rowId = rowId;
	}

	getRetryCount() {
		return this.#retry_count;
	}
	setRetryCount(retry_count) {
		this.#retry_count = retry_count;
	}

	getRequestBodyFileId() {
		return this.#request_body_file_id;
	}
	setRequestBodyFileId(request_body_file_id) {
		this.#request_body_file_id = request_body_file_id;
	}

	getCreatedTime() {
		return this.#created_time;
	}
	setCreatedTime(created_time) {
		this.#created_time = created_time;
	}

	getResponseInfo() {
		return this.#response_info;
	}
	setResponseInfo(response_info) {
		this.#response_info = response_info;
	}

	getRequestMethod() {
		return this.#request_method;
	}
	setRequestMethod(request_method) {
		this.#request_method = request_method;
	}

	getConfigurationId() {
		return this.#configuration_id;
	}
	setConfigurationId(configuration_id) {
		this.#configuration_id = configuration_id;
	}

	getRequestFullPath() {
		return this.#request_full_path;
	}
	setRequestFullPath(request_full_path) {
		this.#request_full_path = request_full_path;
	}

	getRequestContentType() {
		return this.#request_content_type;
	}
	setRequestContentType(request_content_type) {
		this.#request_content_type = request_content_type;
	}

	getResponseStatusCode() {
		return this.#response_status_code;
	}
	setResponseStatusCode(response_status_code) {
		this.#response_status_code = response_status_code;
	}

	getRequestExecutionStatus() {
		return this.#request_execution_status;
	}
	setRequestExecutionStatus(request_execution_status) {
		this.#request_execution_status = request_execution_status;
	}




	loadFromQueryResult(result) {
		const json = result['Payload'];

		this.#rowId = json.ROWID;
		this.#created_time = json.CREATEDTIME;
		this.#response_info = json.RESPONSE_INFO;
		this.#request_method = json.REQUEST_METHOD;
		this.#configuration_id = json.CONFIGURATION_ID;
		this.#request_full_path = json.REQUEST_FULL_PATH;
		this.#request_body_file_id = json.REQUEST_BODY_FILE_ID;
		this.#request_content_type = json.REQUEST_CONTENT_TYPE;
		
		this.#retry_count = parseInt(json.RETRY_COUNT);
		this.#request_execution_status = parseInt(json.REQUEST_EXECUTION_STATUS);
		this.#response_status_code = json.RESPONSE_STATUS_CODE
			? parseInt(json.RESPONSE_STATUS_CODE)
			: null;
	}
}

module.exports = Payload;
