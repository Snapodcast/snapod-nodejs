import Koa from "koa";
import { bootstrap } from "./app.bootstrap";
import "reflect-metadata";
import { Container } from "typedi";
import { useMiddlewares } from "./koa.middlewares";
import { routingConfigs } from "./routing.configs";
import { useKoaServer, useContainer } from "routing-controllers";

export const createServer = async (): Promise<Koa> => {
	const koa: Koa = new Koa();
	useMiddlewares(koa);
	useContainer(Container);
	bootstrap();
	const app: Koa = useKoaServer<Koa>(koa, routingConfigs());
	return app;
};
