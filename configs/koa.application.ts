import Koa from "koa";
import { bootstrap } from "./app.bootstrap";
import "reflect-metadata";
import { Container } from "typedi";
import { useMiddlewares } from "./koa.middlewares";
import { routingConfigs } from "./routing.configs";
import { useKoaServer, useContainer } from "routing-controllers";
import { useGraphQL } from "./graphql.integration";

export const createServer = async (): Promise<Koa> => {
	// load environment variables
	bootstrap();

	// create a Koa instance
	const koa: Koa = new Koa();

	// register Koa middlewares
	useMiddlewares(koa);

	// start apollo graphql server
	return useGraphQL(koa).then(() => {
		// a container is required for a client to request instances in which
		// 	dependencies are injected from TypeDI
		// setup the container for routing-controllers
		useContainer(Container);

		// register controllers and routes using routing-controllers
		const app: Koa = useKoaServer<Koa>(koa, routingConfigs());

		// return Koa application instance
		return app;
	});
};
