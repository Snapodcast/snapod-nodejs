import {
	BadRequestError,
	Post,
	JsonController,
	Body,
} from "routing-controllers";
import { Service } from "typedi";
import { SignUpService } from "../services/signup.service";
import { LoginService } from "../services/login.service";
import validator from "validator";
import cuid from "cuid";
import crypto from "crypto";
import prisma from "../helpers/prisma.client";
import { CredentialInterface } from "../services/signup.service";

@JsonController()
@Service()
export class SignupController {
	constructor(
		private signupService: SignUpService,
		private loginService: LoginService
	) {}

	@Post("/signup")
	async createUser(@Body() user: CredentialInterface) {
		if (!user) {
			throw new BadRequestError("Invalid request");
		}

		// validate email
		if (!user.email || !validator.isEmail(user.email)) {
			throw new BadRequestError("Email is invalid");
		}

		// validate name
		if (
			!user.name ||
			!validator.isLength(user.name, {
				min: 1,
				max: 30,
			})
		) {
			throw new BadRequestError("Username length should be within 1 and 30");
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

		// generate credentials
		const user_cuid = cuid();
		const random_salt = crypto.randomBytes(8).toString("base64");
		const derived_pwd = crypto
			.pbkdf2Sync(user.password, random_salt, 400000, 32, "sha256")
			.toString("base64");

		// create user
		await this.signupService
			.createUser({
				name: user.name,
				cuid: user_cuid,
				email: user.email,
				password: derived_pwd,
				salt: random_salt,
				type: "user",
			})
			.catch(() => {
				throw new BadRequestError("User already exists");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// return message and sign JWT
		return JSON.stringify({
			status: true,
			message: "success",
			info: {
				cuid: user_cuid,
				email: user.email,
				type: "user",
				name: user.name,
			},
			token: this.loginService.sign({
				cuid: user_cuid,
				email: user.email,
				type: "user",
			}),
		});
	}
}
