class PayloadAssetService {
	#catalystApp;
	#files;

	constructor(catalystApp, payload) {
		this.#catalystApp = catalystApp;
		this.#files = payload.getFiles();
	}

	async getAssetAsText(fileName) {
		return this.#catalystApp
			.filestore()
			.folder('CATALYST_AS_BUFFER')
			.downloadFile(this.#files[fileName])
			.then((buffer) => buffer.toString());
	}

	async getAssetAsJson(fileName) {
		return this.getAssetAsText(fileName).then((content) => JSON.parse(content));
	}

	static getInstance(catalystApp, payload) {
		return new PayloadAssetService(catalystApp, payload);
	}
}

module.exports = PayloadAssetService