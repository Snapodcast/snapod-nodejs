import {
	BadRequestError,
	UnauthorizedError,
	NotFoundError,
	Post,
	Body,
	JsonController,
	InternalServerError,
} from "routing-controllers";
import { Service } from "typedi";
import validator from "validator";
import crypto from "crypto";
import prisma from "../helpers/prisma.client";
import { LoginService } from "../services/login.service";
import { CredentialInterface } from "../services/login.service";

@JsonController()
@Service()
export class LoginController {
	constructor(private loginService: LoginService) {}

	@Post("/login")
	async login(@Body() user: CredentialInterface) {
		// validate email
		if (!user.email || !validator.isEmail(user.email)) {
			throw new BadRequestError("Invalid email");
		}

		// validate password
		if (
			!user.password ||
			!validator.isLength(user.password, {
				min: 6,
				max: 20,
			})
		) {
			throw new BadRequestError("Password length should be within 6 and 20");
		}

		// get unique user record
		const findResult = await this.loginService
			.find(user)
			.catch(() => {
				throw new InternalServerError("Service temporarily unavailable");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// not result is found
		if (!findResult) {
			throw new NotFoundError("Invalid email address");
		}

		// sign current password
		const derived_pwd = crypto
			.pbkdf2Sync(user.password, findResult.salt, 400000, 32, "sha256")
			.toString("base64");

		// compare with record password return JWT if matches
		if (findResult.password === derived_pwd) {
			return JSON.stringify({
				status: true,
				message: "success",
				info: {
					name: findResult.name,
					cuid: findResult.cuid,
					email: findResult.email,
					type: findResult.type,
				},
				token: this.loginService.sign({
					cuid: findResult.cuid,
					email: findResult.email,
					type: findResult.type,
				}),
			});
		}

		// authentication failed
		throw new UnauthorizedError("Invalid password");
	}
}
