import {
	BadRequestError,
	Post,
	JsonController,
	Body,
} from "routing-controllers";
import { Service } from "typedi";
import prisma from "../helpers/prisma.client";

BigInt.prototype.toJSON = function () {
	return this.toString();
};

@JsonController()
@Service()
export class SiteInfoController {
	@Post("/siteInfo")
	async fetchRSSData(@Body() body: { customUrl: string, podcastId: number }) {

		if (!body.customUrl && !body.podcastId) {
			throw new BadRequestError("Invalid request");
		}

		let result = null;
		if (body.customUrl) {
			result = await prisma.podcastProfile.findFirst({
				where: {
					snapod_site_custom_url: body.customUrl
				},
				include: {
					podcast: {
						include: {
							author: true
						}
					}
				},
			});
		} else {
			result = await prisma.podcast.findUnique({
				where: {
					id: body.podcastId,
				},
				include: {
					profile: true,
					author: true
				},
			});
		}

		return JSON.stringify(result);
	}
}
