import Koa from "koa";
import { Server } from "http";
import { createServer } from "./configs/koa.application";
import { print } from "./utilities/print";

module.exports = (async (): Promise<Server> => {
	try {
		const app: Koa = await createServer();
		const port = process.env.PORT || process.env.SERVICE_PORT;
		return app.listen(port, () => {
			print.success(
				`Snapod server listening on port ${port} in ${process.env.SERVICE_MODE} mode`
			);
		});
	} catch (e) {
		console.log(e);
	}
})();
