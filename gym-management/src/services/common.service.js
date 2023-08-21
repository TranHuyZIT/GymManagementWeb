class CommonService {
	convertProxyObjectToPojo(proxyObj) {
		return JSON.parse(JSON.stringify(proxyObj));
	}
}

export default new CommonService();
