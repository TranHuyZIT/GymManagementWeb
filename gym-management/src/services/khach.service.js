import Request, { ApiService } from "./api.service";

class KhachService extends ApiService {
	constructor() {
		super();
		this.api = Request("khach/");
	}
	getAllWithParams(params) {
		return this.api.get("/", { params: { ...params } });
	}
}

export default new KhachService();
