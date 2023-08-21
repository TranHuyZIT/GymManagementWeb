import Request, { ApiService } from "./api.service";
class GoiTapService extends ApiService {
	constructor() {
		super();
		this.api = Request("goitap/");
	}
}
export default new GoiTapService();
