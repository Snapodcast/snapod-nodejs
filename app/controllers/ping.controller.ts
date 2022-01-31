import { Get, Post, JsonController, Ctx } from "routing-controllers";
import { Context } from "koa";
import { Service } from "typedi";
import { PingService } from "../services/pong.service";
import { ProfileInterface } from "../services/login.service";

interface JWTContext extends Context {
	state: {
		user: ProfileInterface;
	};
}

@JsonController()
@Service()
export class PingController {
	constructor(private pingService: PingService) { }

	@Get("/ping")
	async getPong() {
		return JSON.stringify({
			message: this.pingService.pong(),
		});
	}

	@Get("/version")
	async getVersion() {
		return JSON.stringify({
			version: process.env.npm_package_version,
		});
	}

	@Get("/latestAppVersion")
	async getLatestAppVersion() {
		return JSON.stringify({
			version: "0.0.4",
		});
	}

	@Post("/ping")
	async postPong() {
		return JSON.stringify({
			message: this.pingService.pong(),
		});
	}

	@Get("/ping/auth")
	async authPong(@Ctx() ctx: JWTContext) {
		return JSON.stringify({
			message: this.pingService.pong(),
			parsed: {
				cuid: ctx.state.user.cuid,
				email: ctx.state.user.email,
				type: ctx.state.user.type,
			} as ProfileInterface,
		});
	}
}
