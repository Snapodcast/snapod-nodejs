import { Service } from "typedi";

@Service()
export class PingService {
	pong() {
		return "pong";
	}
}
