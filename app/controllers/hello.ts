import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { HelloService } from "../services/hello";

@JsonController()
@Service()
export class Hello {
	constructor(private helloservice: HelloService) {}

	@Get("/test")
	async test() {
		return JSON.stringify({
			msg: this.helloservice.create("Snapod"),
		});
	}
}
