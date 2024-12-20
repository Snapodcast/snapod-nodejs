import {
	Resolver,
	Query,
	Arg,
	Mutation,
	UnauthorizedError,
	Ctx,
} from "type-graphql";
import { BadRequestError } from "routing-controllers";
import { Episode } from "../models/Episode";
import prisma from "../../helpers/prisma.client";
import cuid from "cuid";
import { Context } from "koa";
import { ProfileInterface } from "../../services/login.service";
import { VoidOutput } from "../types/global.type";
import {
	EpisodeInput,
	ModifyEpisodeInfoInput,
	ModifyEpisodeProfileInput,
} from "../types/episodes.type";

interface JWTContext extends Context {
	state: {
		user: ProfileInterface;
	};
}

const authentication = async (
	ctx: JWTContext,
	episodeOrPodcastCuid: string,
	episodeOp: boolean
) => {
	let episodeResult: any;
	let podcastResult: any;
	if (episodeOp) {
		episodeResult = await prisma.episode
			.findUnique({
				where: {
					cuid: episodeOrPodcastCuid,
				},
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
		if (!episodeResult) {
			throw new BadRequestError("An unexpected error has occurred");
		}
		episodeOrPodcastCuid = episodeResult.podcastCuid;
	}
	podcastResult = await prisma.podcast
		.findUnique({
			where: {
				cuid: episodeOrPodcastCuid,
			},
		})
		.catch(() => {
			throw new BadRequestError("An unexpected error has occurred");
		});
	if (!podcastResult) {
		throw new BadRequestError("An unexpected error has occurred");
	}
	if (ctx.state.user.cuid !== podcastResult.authorCuid) {
		throw new UnauthorizedError();
	}
};

@Resolver((_of) => Episode)
export class EpisodesResolver {
	@Query((_returns) => [Episode], {
		nullable: true,
		description: "Get a podcast's episodes",
	})
	async episodes(@Arg("podcastCuid") podcastCuid: string) {
		return await prisma.episode.findMany({
			where: {
				podcastCuid,
			},
			include: {
				profile: true,
			},
		});
	}

	@Query((_returns) => Episode, {
		nullable: true,
		description: "Get an episode's profile",
	})
	async episode(@Arg("episodeCuid") episodeCuid: string) {
		return await prisma.episode.findUnique({
			where: {
				cuid: episodeCuid,
			},
			include: {
				profile: true,
			},
		});
	}

	@Mutation((_returns) => Episode, {
		nullable: false,
		description: "Create a new episode",
	})
	async createEpisode(
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("data") input: EpisodeInput,
		@Ctx() ctx: JWTContext
	) {
		await authentication(ctx, podcastCuid, false);

		const episode_cuid = cuid();

		// create episode
		await prisma.episode
			.create({
				data: {
					title: input.title,
					content: input.content,
					published: input.published,
					podcastCuid: podcastCuid,
					cuid: episode_cuid,
					profile: {
						create: input.profile,
					},
				},
			})
			.catch(() => {
				throw new BadRequestError("Error creating an episode");
			});

		return {
			cuid: episode_cuid,
		};
	}

	@Mutation((_returns) => VoidOutput, {
		nullable: false,
		description: "Modify an episode's info",
	})
	async modifyEpisode(
		@Arg("episodeCuid") episodeCuid: string,
		@Arg("info") infoInput: ModifyEpisodeInfoInput,
		@Arg("profile") profileInput: ModifyEpisodeProfileInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, episodeCuid, true);
		// modify episode info
		const modifyInfo = prisma.episode.update({
			where: {
				cuid: episodeCuid,
			},
			data: infoInput,
		});
		// modify episode profile
		const modifyProfile = prisma.episodeProfile.update({
			where: {
				episodeCuid,
			},
			data: profileInput,
		});

		await prisma.$transaction([modifyInfo, modifyProfile]).catch(() => {
			throw new BadRequestError("An unexpected error has occurred");
		});

		return {
			status: true,
			message: "success",
		};
	}

	@Mutation((_returns) => VoidOutput, {
		nullable: false,
		description: "Delete an episode",
	})
	async deleteEpisode(
		@Arg("episodeCuid") episodeCuid: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, episodeCuid, true);
		// delete podcast and podcast profile
		await prisma.episode
			.delete({
				where: {
					cuid: episodeCuid,
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
