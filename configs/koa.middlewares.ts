import Koa from "koa";
import bodyParser from "koa-bodyparser";

export const useMiddlewares = <T extends Koa>(app: T): T => {
	app.use(bodyParser());
	return app;
};
