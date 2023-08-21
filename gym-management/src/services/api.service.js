import Token from "@/utils/token";
import axios from "axios";

export default function Request(baseURL) {
	const client = axios.create({
		baseURL: `http://localhost:5000/${baseURL}`,
	});

	client.interceptors.request.use((req) => {
		req.headers.Authorization = `Bearer ${Token.token}`;

		return req;
	});
	client.interceptors.response.use((res) => {
		return res.data;
	});
	return client;
}

export class ApiService {
	constructor() {
		this.api = Request("/");
	}
	getAll(params) {
		return this.api.get("/", { ...params });
	}

	getById(id) {
		return this.api.get(id);
	}
	create(payload) {
		return this.api.post("/", payload);
	}
	delete(id) {
		return this.api.delete(id);
	}
	update(id, payload) {
		return this.api.put(id, payload);
	}
}
