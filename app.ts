import Koa from "koa";
import { Server } from "http";
import { createServer } from "./configs/koa.application";
import { print } from "./utilities/print";

module.exports = (async (): Promise<Server> => {
	try {
		const app: Koa = await createServer();
		return app.listen(process.env.SERVICE_PORT, () => {
			print.success(
				`Snapod server listening on port ${process.env.SERVICE_PORT} in ${process.env.SERVICE_MODE} mode`
			);
		});
	} catch (e) {
		console.log(e);
	}
})();
