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
	async fetchRSSData(
		@Body() body: { customURL: string; podcastId: number; episodeId: number }
	) {
		if (!body.customURL && !body.podcastId && !body.episodeId) {
			throw new BadRequestError("Invalid request");
		}

		let result = null;
		if (body.customURL) {
			if (body.episodeId) {
				result = await prisma.podcastProfile.findUnique({
					where: {
						snapod_site_custom_url: body.customURL,
					},
					select: {
						podcast: {
							select: {
								name: true,
								cuid: true,
								profile: {
									select: {
										cover_art_image_url: true,
									},
								},
								episodes: {
									where: {
										id: body.episodeId,
									},
									include: {
										profile: true,
									},
								},
								author: true,
								description: true,
							},
						},
					},
				});
			} else {
				result = await prisma.podcastProfile.findFirst({
					where: {
						snapod_site_custom_url: body.customURL,
					},
					include: {
						podcast: {
							include: {
								author: {
									select: {
										name: true,
										email: true,
									},
								},
								episodes: {
									include: {
										profile: true,
									},
								},
								profile: {
									select: {
										cover_art_image_url: true,
									},
								},
							},
						},
					},
				});
			}
		} else {
			if (body.episodeId) {
				result = await prisma.episode.findUnique({
					where: {
						id: body.episodeId,
					},
					include: {
						profile: true,
						podcast: {
							include: {
								author: true,
								profile: {
									select: {
										cover_art_image_url: true,
									},
								},
							},
						},
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
								email: true,
							},
						},
						episodes: {
							include: {
								profile: true,
							},
						},
					},
				});
			}
		}

		return JSON.stringify(result);
	}
}
