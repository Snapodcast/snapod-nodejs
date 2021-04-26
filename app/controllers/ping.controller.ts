import { Get, Post, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { PingService } from "../services/pong.service";

@JsonController()
@Service()
export class PingController {
	constructor(private pingService: PingService) {}

	@Get("/ping")
	async getPong() {
		return JSON.stringify({
			msg: this.pingService.pong(),
		});
	}

	@Post("/ping")
	async postPong() {
		return JSON.stringify({
			msg: this.pingService.pong(),
		});
	}

	@Get("/ping/auth")
	async authPong() {
		return JSON.stringify({
			msg: this.pingService.pong(),
		});
	}
}
