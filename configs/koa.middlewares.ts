import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";

export const useMiddlewares = <T extends Koa>(app: T): T => {
	app.use(bodyParser());

	// handle unauthorized request
	app.use(async (ctx: Context, next: (err?: any) => any) => {
		return next().catch((err: any) => {
			if (401 == err.status) {
				ctx.status = 401;
				ctx.body = "Unauthorized";
			} else {
				ctx.status = 500;
				ctx.body = "Internal Server Error";
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
				`/v${process.env.SERVICE_VERSION}/api/forgot/recover`,
				`/v${process.env.SERVICE_VERSION}/api/forgot/request`,
				`/v${process.env.SERVICE_VERSION}/api/rss`,
				`/v${process.env.SERVICE_VERSION}/api/siteInfo`,
			],
			method: "OPTIONS",
		})
	);

	return app;
};
