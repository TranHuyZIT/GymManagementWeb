import Request, { ApiService } from "./api.service";

class PtService extends ApiService {
	constructor() {
		super();
		this.api = Request("pt/");
	}
}

export default new PtService();
