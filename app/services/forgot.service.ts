import { Service } from "typedi";
import prisma from "../helpers/prisma.client";
import sendEmail from "./mailer.service";

export interface ProfileInterface {
	email: string;
	code: string;
}

@Service()
export class ForgotService {
	async findMatch(email: string) {
		return prisma.user.findUnique({
			where: {
				email,
			},
		});
	}
	async findRequest(email: string, code: string) {
		return prisma.recovery.findFirst({
			where: {
				email: email,
				code: code,
			},
		});
	}
	async updateUser(email: string, password: string, salt: string) {
		// delete recovery request
		await prisma.recovery.delete({
			where: {
				email,
			},
		});
		// update user password
		return prisma.user.update({
			where: {
				email,
			},
			data: {
				password,
				salt,
			},
		});
	}
	async createRequest(profile: ProfileInterface) {
		const createResult = await prisma.recovery.create({
			data: profile,
		});
		if (createResult) {
			sendEmail(
				profile.email,
				"您在 Snapod 的密码找回确认链接 | Password Recovery Link",
				`<h2><span role="img" aria-label="snapod-logo">🎙️</span>Snapod</h2><br/><p>您正在申请找回 Snapod 账户密码，请点击以下链接以开启重置流程:</p><p><a>https://snapodcast.com/forgot/recover/email/${profile.email}/code/${profile.code}</a></p>`
			);
			return Promise.resolve(createResult);
		}
		return Promise.reject();
	}
}
