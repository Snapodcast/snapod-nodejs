import Koa, { Context } from "koa";
import { UnauthorizedError, InternalServerError } from "routing-controllers";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";

export const useMiddlewares = <T extends Koa>(app: T): T => {
	app.use(bodyParser());

	app.use(async (ctx: Context, next: (err?: any) => any) => {
		return next().catch((err: any) => {
			if (401 == err.status) {
				throw new UnauthorizedError("Authorization error");
			} else {
				throw new InternalServerError("Unknown error");
			}
		});
	});

	// JWT middleware
	app.use(
		jwt({
			secret: process.env.SERVICE_JWT_SECRET,
		}).unless({
			path: [
				`/v${process.env.SERVICE_VERSION}/api/login`,
				`/v${process.env.SERVICE_VERSION}/api/ping`,
				`/v${process.env.SERVICE_VERSION}/api/signup`,
			],
			method: "OPTIONS",
		})
	);

	return app;
};
