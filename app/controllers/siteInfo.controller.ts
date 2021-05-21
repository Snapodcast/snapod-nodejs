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
	async fetchRSSData(@Body() body: { customUrl: string, podcastId: number, episodeId: number }) {

		if (!body.customUrl && !body.podcastId && !body.episodeId) {
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
							author: {
								select: {
									name: true,
									email: true
								}
							},
							episodes: {
								include: {
									profile: true
								}
							}
						}
					}
				},
			});
		} else if (body.episodeId) {
			result = await prisma.episode.findUnique({
				where: {
					id: body.episodeId,
				},
				include: {
					profile: true,
					podcast: true
				},
			});
		} else {
			result = await prisma.podcast.findUnique({
				where: {
					id: body.podcastId,
				},
				include: {
					profile: true,
					author: {
						select: {
							name: true,
							email: true
						}
					},
					episodes: {
						include: {
							profile: true
						}
					}
				},
			});
		}

		return JSON.stringify(result);
	}
}
