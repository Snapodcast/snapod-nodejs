import { Service } from "typedi";
import prisma from "../helpers/prisma.client";
import { Prisma } from "@prisma/client";

@Service()
export class SignUpService {
	async createUser(credential: Prisma.UserCreateInput) {
		return prisma.user.create({
			data: credential
		})
	}
}
