import { Service } from "typedi";
import prisma from "../helpers/prisma.client";
import { Prisma } from "@prisma/client";

export interface CredentialInterface {
	name: string;
	email: string;
	password: string;
}

@Service()
export class SignUpService {
	async createUser(credential: Prisma.UserCreateInput) {
		// user already exist
		if (
			await prisma.user.findUnique({
				where: {
					email: credential.email,
				},
			})
		) {
			return Promise.reject();
		}
		return prisma.user.create({
			data: credential,
		});
	}
}
