import Request from "./api.service";
class AuthService {
	constructor(baseUrl = "") {
		this.api = Request(baseUrl);
	}
	async register(body, path = "khach/") {
		return await this.api.post(path, body);
	}
	async login(body) {
		return await this.api.post("auth/login", body);
	}
	async getIdentity() {
		return await this.api.get("auth");
	}
}
export default new AuthService();
