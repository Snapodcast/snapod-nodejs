import { RoutingControllersOptions } from "routing-controllers";
import { join } from "path";
import { print } from "../utilities/print";
import { CorsMiddleware } from "./routing.middlewares";

export const routingConfigs = (): RoutingControllersOptions => {
	print.success(`REST API route prefix: /v${process.env.SERVICE_VERSION}/api`);
	return {
		controllers: [join(__dirname, "../app/controllers/*")],
		middlewares: [CorsMiddleware],
		routePrefix: `/v${process.env.SERVICE_VERSION}/api`,
		validation: true,
	};
};
