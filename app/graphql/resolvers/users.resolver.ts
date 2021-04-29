import {
	Resolver,
	Arg,
	Args,
	Mutation,
	UnauthorizedError,
	Ctx,
} from "type-graphql";
import { BadRequestError } from "routing-controllers";
import crypto from "crypto";
import { User } from "../models/User";
import prisma from "../../helpers/prisma.client";
import { Context } from "koa";
import { ProfileInterface } from "../../services/login.service";
import { ModifyUserInfoInput } from "../types/users.type";
import { VoidOutput } from "../types/global.type";

interface JWTContext extends Context {
	state: {
		user: ProfileInterface;
	};
}

const authentication = (ctx: JWTContext, cuid: string) => {
	if (ctx.state.user.cuid !== cuid) {
		throw new UnauthorizedError();
	}
};

@Resolver((_of) => User)
export class UsersResolver {
	@Mutation((_returns) => User, {
		nullable: false,
		description: "Modify a user's name or email",
	})
	async modifyUserInfo(
		@Arg("userCuid") userCuid: string,
		@Arg("data") input: ModifyUserInfoInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, userCuid);
		return await prisma.user
			.update({
				where: {
					cuid: userCuid,
				},
				data: input,
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
	}

	@Mutation((_returns) => VoidOutput, {
		nullable: false,
		description: "Modify a user's password",
	})
	async modifyUserPwd(
		@Arg("userCuid") userCuid: string,
		@Arg("oldPassword") oldPassword: string,
		@Arg("newPassword") newPassword: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, userCuid);

		const findResult = await prisma.user
			.findUnique({
				where: {
					cuid: userCuid,
				},
			})
			.catch(() => {
				throw new BadRequestError();
			});

		const derived_old_pwd = crypto
			.pbkdf2Sync(oldPassword, findResult.salt, 400000, 32, "sha256")
			.toString("base64");

		if (derived_old_pwd !== findResult.password) {
			throw new UnauthorizedError();
		}

		const random_salt = crypto.randomBytes(8).toString("base64");
		const derived_new_pwd = crypto
			.pbkdf2Sync(newPassword, random_salt, 400000, 32, "sha256")
			.toString("base64");

		await prisma.user
			.update({
				where: {
					cuid: userCuid,
				},
				data: {
					password: derived_new_pwd,
				},
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});

		return {
			status: true,
			message: "success",
		};
	}
}
