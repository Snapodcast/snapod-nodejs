import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import ratelimit from "koa-ratelimit";

export const useMiddlewares = <T extends Koa>(app: T): T => {
	app.use(bodyParser());

	// Handle unauthorized request
	app.use(async (ctx: Context, next: (err?: any) => any) => {
		return next().catch((err: any) => {
			if (401 == err.status) {
				ctx.status = 401;
				ctx.body = "Unauthorized";
			} else {
				ctx.status = 500;
				ctx.body = "Service temporarily unavailable";
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
				`/v${process.env.SERVICE_VERSION}/api/version`,
				`/v${process.env.SERVICE_VERSION}/api/signup`,
				`/v${process.env.SERVICE_VERSION}/api/forgot/recover`,
				`/v${process.env.SERVICE_VERSION}/api/forgot/request`,
				`/v${process.env.SERVICE_VERSION}/api/rss`,
				`/v${process.env.SERVICE_VERSION}/api/siteInfo`,
				`/v${process.env.SERVICE_VERSION}/api/latestAppVersion`,
			],
			method: "OPTIONS",
		})
	);

	// RateLimit memory driver
	const db = new Map();

	// RateLimit middleware (100 request per minute)
	app.use(
		ratelimit({
			driver: "memory",
			db: db,
			duration: 60000,
			errorMessage: "Rate limit exceeded",
			id: (ctx) => ctx.ip,
			headers: {
				remaining: "Rate-Limit-Remaining",
				reset: "Rate-Limit-Reset",
				total: "Rate-Limit-Total",
			},
			max: 100,
			disableHeader: false,
		})
	);

	return app;
};
