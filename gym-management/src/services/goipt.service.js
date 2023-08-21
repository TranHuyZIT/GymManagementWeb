import Request, { ApiService } from "./api.service";

class GoiPtService extends ApiService {
	constructor() {
		super();
		this.api = Request("goipt/");
	}
}

export default new GoiPtService();
