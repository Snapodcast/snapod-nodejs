import {
	BadRequestError,
	UnauthorizedError,
	NotFoundError,
	Get,
	JsonController,
	QueryParam,
} from "routing-controllers";
import { Service } from "typedi";
import validator from "validator";
import crypto from "crypto";
import prisma from "../helpers/prisma.client";
import { LoginService } from "../services/login.service";

export interface CredentialInterface {
	email: string;
	password: string;
}

@JsonController()
@Service()
export class LoginController {
	constructor(private loginService: LoginService) {}

	@Get("/login")
	async login(
		@QueryParam("email") email: string,
		@QueryParam("password") password: string
	) {
		const user: CredentialInterface = {
			email,
			password,
		};

		// validate email
		if (!user.email || !validator.isEmail(user.email)) {
			throw new BadRequestError("Email is invalid");
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
				throw new NotFoundError("User not found");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// sign current password
		const derived_pwd = crypto
			.pbkdf2Sync(user.password, findResult.salt, 400000, 32, "sha256")
			.toString("base64");

		// compare with record password return JWT if matches
		if (findResult.password === derived_pwd) {
			return JSON.stringify({
				status: true,
				msg: "success",
				token: this.loginService.sign({
					uuid: findResult.uuid,
					email: findResult.email,
					type: findResult.type,
				}),
			});
		}

		// authentication failed
		throw new UnauthorizedError("Current credential is not correct");
	}
}
