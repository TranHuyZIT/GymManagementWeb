import Request, { ApiService } from "./api.service";

class HoaDonService extends ApiService {
	constructor() {
		super();
		this.api = Request("hoadon/");
	}

	create(payload) {
		return this.api.post("khach", payload);
	}

	check(id) {
		return this.api.post(`duyet/${id}`);
	}
	getAllWithParams(params) {
		return this.api.get("", { params: { ...params } });
	}
}

export default new HoaDonService();
