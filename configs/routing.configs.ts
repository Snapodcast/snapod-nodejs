import { RoutingControllersOptions } from "routing-controllers";
import { join } from "path";
import { print } from "../utilities/print";
import { HeaderMiddleware } from "./routing.middlewares";

export const routingConfigs = (): RoutingControllersOptions => {
	print.success(`API route prefix: /v${process.env.SERVICE_VERSION}/api`);
	return {
		controllers: [join(__dirname, "../app/controllers/*.ts")],
		middlewares: [HeaderMiddleware],
		routePrefix: `/v${process.env.SERVICE_VERSION}/api`,
		validation: true,
	};
};
