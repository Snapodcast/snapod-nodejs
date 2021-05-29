import {
	BadRequestError,
	NotFoundError,
	Post,
	JsonController,
	Body,
	InternalServerError,
} from "routing-controllers";
import { Service } from "typedi";
import validator from "validator";
import crypto from "crypto";
import prisma from "../helpers/prisma.client";
import { ForgotService } from "../services/forgot.service";

interface RecoverInterface {
	email: string;
	code: string;
	password: string;
}

@JsonController()
@Service()
export class ForgotRecoverController {
	constructor(private forgotService: ForgotService) {}

	@Post("/forgot/recover")
	async login(@Body() body: RecoverInterface) {
		// validate code
		if (!body.code || body.code.length !== 44) {
			throw new BadRequestError("Invalid code");
		}

		// validate password
		if (
			!body.password ||
			!validator.isLength(body.password, {
				min: 6,
				max: 20,
			})
		) {
			throw new BadRequestError("Password length should be within 6 and 20");
		}

		// get unique request
		const findRequestResult = await this.forgotService
			.findRequest(body.code)
			.catch(() => {
				throw new InternalServerError("Service temporarily unavailable");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// not request is found
		if (!findRequestResult) {
			throw new NotFoundError("Invalid code or request");
		}

		// generate credentials
		const random_salt = crypto.randomBytes(8).toString("base64");
		const derived_pwd = crypto
			.pbkdf2Sync(body.password, random_salt, 400000, 32, "sha256")
			.toString("base64");

		// update password
		await this.forgotService
			.updateUser(findRequestResult.email, derived_pwd, random_salt)
			.catch(() => {
				throw new BadRequestError("User already exists");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		return JSON.stringify({
			status: true,
			message: "success",
		});
	}
}
