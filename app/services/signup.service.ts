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
		return prisma.user.create({
			data: credential,
		});
	}
}
