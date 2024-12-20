import {
	Resolver,
	Query,
	Arg,
	Mutation,
	UnauthorizedError,
	Ctx,
} from "type-graphql";
import { BadRequestError } from "routing-controllers";
import { Podcast } from "../models/Podcast";
import prisma from "../../helpers/prisma.client";
import cuid from "cuid";
import { Context } from "koa";
import { ProfileInterface } from "../../services/login.service";
import {
	PodcastInput,
	ModifyInfoInput,
	ModifyProfileInput,
} from "../types/podcasts.type";
import { VoidOutput, Preview } from "../types/global.type";
import NetlifyAPI from "netlify";
import Parser from "rss-parser";
import TurndownService from "turndown";

const turndownService = new TurndownService();
const parser: Parser = new Parser();
const client = new NetlifyAPI(process.env.NETLIFY_KEY);

interface JWTContext extends Context {
	state: {
		user: ProfileInterface;
	};
}

// authenticate current requester
const authentication = async (
	ctx: JWTContext,
	podcastOrUserCuid: string,
	podcastOp: boolean
) => {
	if (podcastOp) {
		const podcastResult = await prisma.podcast
			.findUnique({
				where: {
					cuid: podcastOrUserCuid,
				},
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
		if (podcastResult.authorCuid !== ctx.state.user.cuid) {
			throw new UnauthorizedError();
		}
	} else {
		if (podcastOrUserCuid !== ctx.state.user.cuid) {
			throw new UnauthorizedError();
		}
	}
};

@Resolver((_of) => Podcast)
export class PodcastsResolver {
	@Query((_returns) => [Podcast], {
		nullable: true,
		description: "Get author's podcasts",
	})
	async podcasts(@Arg("authorCuid") authorCuid: string) {
		return await prisma.podcast.findMany({
			where: {
				authorCuid: authorCuid,
			},
			include: {
				profile: true,
			},
		});
	}

	@Query((_returns) => Podcast, {
		nullable: true,
		description: "Get a podcast's info and profile",
	})
	async podcast(@Arg("podcastCuid") podcastCuid: string) {
		return await prisma.podcast.findUnique({
			where: {
				cuid: podcastCuid,
			},
			include: {
				profile: true,
			},
		});
	}

	@Mutation((_returns) => Podcast, {
		nullable: false,
		description: "Create a new podcast",
	})
	async createPodcast(
		@Arg("authorCuid") authorCuid: string,
		@Arg("data") input: PodcastInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid, false);
		const podcast_cuid = cuid();
		let podcast_profile: any = input.profile;
		if (input.profile.copyright) {
			podcast_profile.copyright = input.profile.copyright;
		}
		if (input.profile.ownerName && input.profile.ownerEmail) {
			podcast_profile.ownerName = input.profile.ownerName;
			podcast_profile.ownerEmail = input.profile.ownerEmail;
		}
		// create podcast
		return await prisma.podcast
			.create({
				data: {
					name: input.name,
					description: input.description,
					authorCuid: authorCuid,
					cuid: podcast_cuid,
					type: input.type,
					profile: {
						create: podcast_profile,
					},
				},
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
	}

	@Mutation((_returns) => VoidOutput, {
		nullable: false,
		description: "Modify a podcast's info and profile",
	})
	async modifyPodcast(
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("info") infoInput: ModifyInfoInput,
		@Arg("profile") profileInput: ModifyProfileInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, podcastCuid, true);
		// modify podcast
		const modifyInfo = prisma.podcast.update({
			where: {
				cuid: podcastCuid,
			},
			data: infoInput,
		});
		// modify podcast profile
		const modifyProfile = prisma.podcastProfile.update({
			where: {
				podcastCuid,
			},
			data: profileInput,
		});

		await prisma.$transaction([modifyInfo, modifyProfile]).catch(() => {
			throw new BadRequestError("An unexpected error has occurred");
		});

		return {
			status: true,
			message: "success",
			name: infoInput.name,
		};
	}

	@Mutation((_returns) => VoidOutput, {
		nullable: false,
		description: "Delete a podcast",
	})
	async deletePodcast(
		@Arg("podcastCuid") podcastCuid: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, podcastCuid, true);
		// delete podcast's episodes
		const deleteEpisodes = prisma.episode.deleteMany({
			where: {
				podcastCuid: podcastCuid,
			},
		});

		// delete podcast and podcast profile
		const deleteCurrentPodcast = prisma.podcast.delete({
			where: {
				cuid: podcastCuid,
			},
		});

		await prisma
			.$transaction([deleteEpisodes, deleteCurrentPodcast])
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});

		return {
			status: true,
			message: "success",
		};
	}

	@Mutation((_returns) => VoidOutput, {
		nullable: false,
		description: "Change custom domain for Snapod site",
	})
	async modifyCustomDomain(
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("customDomain") customDomain: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, podcastCuid, true);

		// get current domain
		const result = await prisma.podcastProfile.findUnique({
			where: {
				podcastCuid,
			},
			select: {
				snapod_site_custom_url: true,
			},
		});
		const currentDomain = result.snapod_site_custom_url;

		// update database
		await prisma.podcastProfile.update({
			where: {
				podcastCuid,
			},
			data: {
				snapod_site_custom_url: customDomain,
			},
		});

		/* Netlify Operations */
		// fetch snapod site
		const snapodSite = await client.getSite({
			site_id: "c4aa5329-e0a4-45e9-a979-84daec85ebb9",
		});
		const existingDomains = snapodSite.domain_aliases;

		if (customDomain && customDomain !== "") {
			// changing the domain
			// validate domain
			if (customDomain.indexOf(".") === -1) {
				throw new BadRequestError("Invalid domain");
			}

			// proceeds if target domain does not exist
			if (existingDomains.indexOf(customDomain) === -1) {
				// update domain aliases
				await client.updateSite({
					site_id: "c4aa5329-e0a4-45e9-a979-84daec85ebb9",
					body: {
						domain_aliases: [...existingDomains, customDomain],
					},
				});
			}
		} else {
			// removing the domain
			const domainIndex = existingDomains.indexOf(currentDomain);
			// proceeds if current domain exists
			if (domainIndex !== -1) {
				existingDomains.splice(domainIndex, 1);
				// update domain aliases
				await client.updateSite({
					site_id: "c4aa5329-e0a4-45e9-a979-84daec85ebb9",
					body: {
						domain_aliases: existingDomains,
					},
				});
			}
		}

		return {
			status: true,
			message: "success",
		};
	}

	@Query((_returns) => Preview, {
		nullable: true,
		description: "Preview a podcast from a RSS url",
	})
	async previewPodcast(
		@Arg("podcastRssUrl") podcastRssUrl: string
	): Promise<Preview> {
		const feed = await parser.parseURL(podcastRssUrl);
		let episodes = [];

		feed.items.map((item) => {
			episodes[episodes.length] = {
				episode: {
					title: item.title,
					content: item.content,
				},
				profile: {
					audio_url: item.enclosure.url,
					audio_size: item.enclosure.length,
					cover_art_image_url: item.itunes?.image,
					clean_content: item.itunes?.explicit !== "no",
					episode_number: parseInt(item.itunes?.episode),
				},
			};
		});

		return {
			podcast: {
				name: feed.title,
				description: feed.description,
				author: feed.author,
			},
			profile: {
				cover_art_image_url: feed.itunes?.image,
				category_name: feed.itunes?.categories[0],
				language: feed.language,
				clean_content: feed.itunes?.explicit !== "no",
				website_url: feed.link,
				copyright: feed.copyright,
				ownerEmail: feed.itunes?.owner?.email,
				ownerName: feed.itunes?.owner?.name,
			},
			episodes: episodes,
		};
	}

	@Mutation((_returns) => Podcast, {
		nullable: false,
		description: "Import a podcast via RSS url",
	})
	async importPodcast(
		@Arg("authorCuid") authorCuid: string,
		@Arg("podcastRssUrl") podcastRssUrl: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid, false);
		const podcastCuid = cuid();

		const feed = await parser.parseURL(podcastRssUrl);

		// create podcast
		const importedPodcast = await prisma.podcast
			.create({
				data: {
					name: feed.title,
					description: feed.description,
					authorCuid: authorCuid,
					cuid: podcastCuid,
					type: "episodic",
					profile: {
						create: {
							cover_art_image_url: feed.itunes?.image,
							category_name: feed.itunes?.categories[0],
							language: feed.language,
							clean_content: feed.itunes?.explicit !== "no",
							website_url: feed.link,
							copyright: feed.copyright,
							ownerEmail: feed.itunes?.owner?.email,
							ownerName: feed.itunes?.owner?.name,
						},
					},
				},
			})
			.catch(() => {
				throw new BadRequestError("Error importing a podcast");
			});

		// import episodes
		await Promise.all(
			feed.items.map(async (item) => {
				await prisma.episode
					.create({
						data: {
							title: item.title,
							content: turndownService.turndown(item.content),
							published: true,
							podcastCuid: podcastCuid,
							cuid: cuid(),
							profile: {
								create: {
									audio_url: item.enclosure.url,
									audio_size:
										typeof item.enclosure.length === "string"
											? parseInt(item.enclosure.length)
											: item.enclosure.length,
									cover_art_image_url: item.itunes?.image,
									clean_content: item.itunes?.explicit !== "no",
									episode_number: parseInt(item.itunes?.episode),
									episode_type: "full",
								},
							},
						},
					})
					.catch((e) => {
						console.log(e);
						throw new BadRequestError("Error importing an episode");
					});
			})
		);

		return importedPodcast;
	}
}
