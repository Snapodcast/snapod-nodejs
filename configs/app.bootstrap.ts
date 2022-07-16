import { join } from "path";
import { print } from "../utilities/print";
import dotenv from "dotenv";

export const bootstrap = () => {
	// load .env file
	const loadResult = dotenv.config();
	if (loadResult.error) {
		print.log("/.env not found");
	} else {
		print.success("Environment variable loaded: /.env");
	}

	// load env .env
	const mode = process.env.NODE_ENV === "development" ? "dev" : "prod";
	dotenv.config({
		path: join(__dirname, `env/${mode}.env`),
	});
	print.success(`Environment variable loaded: ${mode}.env`);
};
