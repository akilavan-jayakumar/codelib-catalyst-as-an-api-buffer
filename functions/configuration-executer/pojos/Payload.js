class Payload {
	#rowId;
	#files;
	#retry_count;
	#request_body;
	#created_time;
	#response_info;
	#request_method;
	#configuration_id;
	#request_full_path;
	#request_content_type;
	#response_status_code;
	#request_execution_status;

	constructor() {
		this.#files = {};
	}

	getRowId() {
		return this.#rowId;
	}
	setRowId(rowId) {
		this.#rowId = rowId;
	}

	getFiles() {
		return this.#files;
	}
	setFiles(files) {
		this.#files = files;
	}

	getRetryCount() {
		return this.#retry_count;
	}
	setRetryCount(retry_count) {
		this.#retry_count = retry_count;
	}

	getRequestBody() {
		return this.#request_body;
	}
	setRequestBody(request_body) {
		this.#request_body = request_body;
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

	getResponseJson() {
		return {
			rowId: this.#rowId,
			retry_count: this.#retry_count,
			request_body: this.#request_body,
			created_time: this.#created_time,
			response_info: this.#response_info,
			request_method: this.#request_method,
			configuration_id: this.#configuration_id,
			request_full_path: this.#request_full_path,
			request_content_type: this.#request_content_type,
			response_status_code: this.#response_status_code,
			request_execution_status: this.#request_execution_status
		};
	}

	getInsertPayload() {
		return {
			RETRY_COUNT: this.#retry_count,
			REQUEST_BODY: this.#request_body,
			FILES: JSON.stringify(this.#files),
			REQUEST_METHOD: this.#request_method,
			CONFIGURATION_ID: this.#response_info,
			REQUEST_FULL_PATH: this.#request_full_path,
			REQUEST_CONTENT_TYPE: this.#request_content_type,
			REQUEST_EXECUTION_STATUS: this.#request_execution_status
		};
	}

	getUpdatePayload() {
		return {
			ROWID: this.#rowId,
			RETRY_COUNT: this.#retry_count,
			FILES: JSON.stringify(this.#files),
			RESPONSE_INFO: this.#response_info,
			RESPONSE_STATUS_CODE: this.#response_status_code,
			REQUEST_EXECUTION_STATUS: this.#request_execution_status
		};
	}

	loadFromQueryResult(payload) {
		const json = payload['Payload'];

		this.#rowId = json.ROWID;
		this.#retry_count = json.RETRY_COUNT;
		this.#request_body = json.REQUEST_BODY;
		this.#created_time = json.CREATEDTIME;
		this.#response_info = json.RESPONSE_INFO;
		this.#configuration_id = json.CONFIGURATION_ID;
		this.#request_full_path = json.REQUEST_FULL_PATH;

		this.#files = JSON.parse(json.FILES);

		this.#request_method = parseInt(json.REQUEST_METHOD);
		this.#request_content_type = parseInt(json.REQUEST_CONTENT_TYPE);
		this.#response_status_code = parseInt(json.RESPONSE_STATUS_CODE);
		this.#request_execution_status = parseInt(json.REQUEST_EXECUTION_STATUS);
	}
}

module.exports = Payload;
