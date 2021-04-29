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
	async findRequest(code: string) {
		return prisma.recovery.findUnique({
			where: {
				code,
			},
		});
	}
	async updateUser(email: string, password: string, salt: string) {
		// delete recovery request record
		await prisma.recovery.deleteMany({
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
				"您在 Snapod 的密码找回秘钥 | Password Recovery Code",
				`<h2><span role="img" aria-label="snapod-logo">🎙️</span>Snapod</h2><br/><p>您正在申请找回 Snapod 账户密码，请输入以下秘钥以完成密码重设:</p><p><b>${profile.code}</b></p><p>如果这不是您的操作，请忽略，您的账户仍然安全</p>`
			);
			return Promise.resolve(createResult);
		}
		return Promise.reject();
	}
}
