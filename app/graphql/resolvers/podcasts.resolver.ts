import {
	Resolver,
	Query,
	Arg,
	Args,
	ArgsType,
	InputType,
	Mutation,
	Field,
	UnauthorizedError,
	Ctx,
} from "type-graphql";
import { InternalServerError } from "routing-controllers";
import { Podcast } from "../models/Podcast";
import prisma from "../../helpers/prisma.client";
import cuid from "cuid";
import { Context } from "koa";
import { ProfileInterface } from "../../services/login.service";

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

@InputType()
class PodcastProfileInput {
	@Field({
		description: "Podcast language",
		nullable: false,
	})
	public language: string;

	@Field({
		description: "Podcast category",
		nullable: false,
	})
	public category: string;

	@Field({
		description: "Podcast content type",
		nullable: false,
	})
	public contentClean: boolean;

	@Field({
		description: "Podcast cover art url",
		nullable: false,
	})
	coverImageUrl: string;
}

@ArgsType()
class PodcastInput {
	@Field({
		description: "Podcast author CUID",
		nullable: false,
	})
	public authorCuid: string;

	@Field({
		description: "Podcast name",
		nullable: false,
	})
	public name: string;

	@Field({
		description: "Podcast description",
		nullable: false,
	})
	public description: string;

	@Field(() => PodcastProfileInput, {
		description: "Podcast profile",
		nullable: false,
	})
	public profile: {
		language: string;
		category: string;
		contentClean: boolean;
		coverImageUrl: string;
	};
}

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
		});
	}

	@Mutation((_returns) => Podcast, {
		nullable: false,
		description: "Create a new podcast",
	})
	async createPodcast(
		@Args()
		{
			name,
			authorCuid,
			description,
			profile: { language, category, contentClean, coverImageUrl },
		}: PodcastInput,
		@Ctx() ctx: JWTContext
	) {
		authentication(ctx, authorCuid);
		const podcast_cuid = cuid();
		// create podcast
		await prisma.podcast
			.create({
				data: {
					name: name,
					description: description,
					authorCuid: authorCuid,
					cuid: podcast_cuid,
				},
			})
			.catch(() => {
				throw new InternalServerError("An unexpected error has occurred");
			});
		// create podcast profile
		await prisma.podcastProfile
			.create({
				data: {
					language: language,
					category_name: category,
					clean_content: contentClean,
					cover_art_image_url: coverImageUrl,
					podcastCuid: podcast_cuid,
				},
			})
			.catch(() => {
				throw new InternalServerError("An unexpected error has occurred");
			});
		return {
			cuid: podcast_cuid,
		};
	}
}
