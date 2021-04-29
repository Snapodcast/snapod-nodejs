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

const authentication = (ctx: JWTContext, cuid: string) => {
	if (ctx.state.user.cuid !== cuid) {
		throw new UnauthorizedError();
	}
};

@Resolver((_of) => Podcast)
export class PodcastsResolver {
	@Query((_returns) => [Podcast], {
		nullable: true,
		description: "Get author's podcasts",
	})
	async podcasts(
		@Arg("authorCuid") authorCuid: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid);
		return prisma.podcast.findMany({
			where: {
				authorCuid: authorCuid,
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
		authentication(ctx, authorCuid);
		const podcast_cuid = cuid();
		// create podcast
		await prisma.podcast
			.create({
				data: {
					name: input.name,
					description: input.description,
					authorCuid: authorCuid,
					cuid: podcast_cuid,
				},
			})
			.catch(() => {
				throw new BadRequestError("An unexpected error has occurred");
			});
		// create podcast profile
		await prisma.podcastProfile
			.create({
				data: {
					language: input.profile.language,
					category_name: input.profile.category,
					clean_content: input.profile.contentClean,
					cover_art_image_url: input.profile.coverImageUrl,
					podcastCuid: podcast_cuid,
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
		@Arg("authorCuid") authorCuid: string,
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("data") input: ModifyInfoInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid);
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
		description: "Modify a podcast's info",
	})
	async modifyPodcastProfile(
		@Arg("authorCuid") authorCuid: string,
		@Arg("podcastCuid") podcastCuid: string,
		@Arg("data") input: ModifyProfileInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid);
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
		description: "Delete a new podcast",
	})
	async deletePodcast(
		@Arg("authorCuid") authorCuid: string,
		@Arg("podcastCuid") podcastCuid: string,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid);
		// delete podcast and podcast profile
		await prisma.podcast
			.delete({
				where: {
					cuid: podcastCuid,
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
