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
import { VoidOutput } from "../types/global.type";
import { PodcastProfile } from "../models/PodcastProfile";

interface JWTContext extends Context {
	state: {
		user: ProfileInterface;
	};
}

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
		description: "Get a podcast's profile",
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
		// create podcast
		await prisma.podcast
			.create({
				data: {
					name: input.name,
					description: input.description,
					authorCuid: authorCuid,
					cuid: podcast_cuid,
					profile: {
						create: {
							language: input.profile.language,
							category_name: input.profile.category,
							clean_content: input.profile.contentClean,
							cover_art_image_url: input.profile.coverImageUrl,
						},
					},
				},
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});

		return {
			cuid: podcast_cuid,
		};
	}

	@Mutation((_returns) => Podcast, {
		nullable: false,
		description: "Modify a podcast's info",
	})
	async modifyPodcastInfo(
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("data") input: ModifyInfoInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, podcastCuid, true);
		// modify podcast
		return await prisma.podcast
			.update({
				where: {
					cuid: podcastCuid,
				},
				data: input,
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
	}

	@Mutation((_returns) => PodcastProfile, {
		nullable: false,
		description: "Modify a podcast's profile",
	})
	async modifyPodcastProfile(
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("data") input: ModifyProfileInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, podcastCuid, true);
		// modify podcast profile
		return await prisma.podcastProfile
			.update({
				where: {
					podcastCuid: podcastCuid,
				},
				data: input,
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
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
}
