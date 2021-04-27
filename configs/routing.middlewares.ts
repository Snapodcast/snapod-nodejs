import { KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";

@Middleware({ type: "before" })
@Service()
export class CorsMiddleware implements KoaMiddlewareInterface {
	async use(context: any, next: (err?: any) => any): Promise<any> {
		context.set(
			"Access-Control-Allow-Methods",
			"GET,POST"
		);
		context.set(
			"Access-Control-Allow-Origin",
			context.request.header.origin || context.request.origin
		);
		context.set("Access-Control-Allow-Headers", [
			"Origin",
			"Content-Type",
			"Authorization",
		]);
		context.set("Access-Control-Allow-Credentials", "true");
		context.set("Content-Type", "application/json; charset=utf-8");
		context.set("ping", "pong");
		return next();
	}
}
