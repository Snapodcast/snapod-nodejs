import { Service } from "typedi";
import prisma from "../helpers/prisma.client";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CredentialInterface } from "../controllers/login.controller";

interface ProfileInterface {
	uuid: string;
	email: string;
	type: string;
}

@Service()
export class LoginService {
	async find(user: CredentialInterface) {
		return prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
	}
	sign(profile: ProfileInterface) {
		return jwt.sign(profile, process.env.SERVICE_JWT_SECRET, {
			noTimestamp: true,
			expiresIn: "7d",
		});
	}
}
