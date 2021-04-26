import { join } from "path";
import { print } from "../utilities/print";
import dotenv from "dotenv";

export const bootstrap = () => {
	const loadResult = dotenv.config();

	if (loadResult.error) {
		print.log("/.env not found");

		// load default env
		const mode = process.env.NODE_ENV == "development" ? "dev" : "prod";
		dotenv.config({
			path: join(__dirname, `env/${mode}.env`),
		});
		print.success(`Environment variable loaded: default ${mode}.env`);
		return;
	}

	print.success("Environment variable loaded: /.env");
};
