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
export class RSSController {
	@Post("/rss")
	async fetchRSSData(@Body() body: { podcastId: number }) {
		if (!body.podcastId) {
			throw new BadRequestError("Invalid request");
		}

		const result = await prisma.podcast.findUnique({
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
						profile: true,
					},
				},
			},
		});

		return JSON.stringify(result);
	}
}
