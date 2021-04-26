import {
	BadRequestError,
	InternalServerError,
	Post,
	JsonController,
	Body,
} from "routing-controllers";
import { Service } from "typedi";
import { SignUpService } from "../services/signup.service";
import { LoginService } from "../services/login.service";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import prisma from "../helpers/prisma.client";

interface CredentialInterface {
	name: string;
	email: string;
	password: string;
}

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
		const uuid = uuidv4();
		const random_salt = crypto.randomBytes(8).toString("base64");
		const derived_pwd = crypto
			.pbkdf2Sync(user.password, random_salt, 400000, 32, "sha256")
			.toString("base64");

		// create user
		await this.signupService
			.createUser({
				uuid: uuid,
				email: user.email,
				password: derived_pwd,
				salt: random_salt,
				type: "user",
			})
			.catch(() => {
				throw new InternalServerError("Internal server error");
			})
			.finally(async () => {
				await prisma.$disconnect();
			});

		// return message and sign JWT
		return JSON.stringify({
			status: true,
			msg: "success",
			token: this.loginService.sign({
				uuid: uuid,
				email: user.email,
				type: "user",
			}),
		});
	}
}
