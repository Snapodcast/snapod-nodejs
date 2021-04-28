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

@JsonController()
@Service()
export class ForgotRequestController {
	constructor(private forgotService: ForgotService) {}

	@Post("/forgot/request")
	async forgotRequest(@Body() body: { email: string }) {
		// validate email
		if (!body.email || !validator.isEmail(body.email)) {
			throw new BadRequestError("Invalid email");
		}

		// get unique user record
		const findResult = await this.forgotService
			.findMatch(body.email)
			.catch(() => {
				throw new InternalServerError("Internal server error");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// not result is found
		if (!findResult) {
			throw new NotFoundError("Invalid email address");
		}

		// generate recovery code
		const random_salt = crypto.randomBytes(8).toString("base64");
		const derived_code = crypto
			.pbkdf2Sync(body.email, random_salt, 400000, 32, "sha256")
			.toString("base64");

		// create request record
		await this.forgotService
			.createRequest({
				email: body.email,
				code: derived_code,
			})
			.catch(() => {
				throw new BadRequestError("Password recovery request has been created");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// return message and sign JWT
		return JSON.stringify({
			status: true,
			message: "success",
		});
	}
}
