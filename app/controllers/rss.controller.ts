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
	async fetchRSSData(@Body() body: { podcastCuid: string }) {
		if (!body.podcastCuid) {
			throw new BadRequestError("Invalid request");
		}

		const result = await prisma.podcast.findUnique({
			where: {
				cuid: body.podcastCuid,
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
