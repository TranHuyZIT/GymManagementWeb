import Request from "./api.service";
import axios from "axios";
class AudioService {
	constructor() {
		this.api = Request("/");
	}
	sendSpeechAudio(blob) {
		return axios.post(
			"https://api.fpt.ai/hmi/asr/general",
			blob,
			{
				headers: {
					"Content-Type": "",
					api_key: "LNCcJhHwoE4t0a83mv7d4GoQX7reK6u2",
				},
			}
		);
	}
}
export default new AudioService();
