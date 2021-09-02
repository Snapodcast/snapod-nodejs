import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Episode } from "./Episode";

@TypeGraphQL.ObjectType({
	isAbstract: true,
})
export class EpisodeProfile {
	@TypeGraphQL.Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	id!: bigint;

	@TypeGraphQL.Field((_type) => String, {
		nullable: false,
	})
	audio_url!: string;

	@TypeGraphQL.Field((_type) => String, {
		nullable: true,
	})
	audio_duration?: string;

	@TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
		nullable: false,
	})
	audio_size!: number;

	@TypeGraphQL.Field((_type) => String, {
		nullable: true,
	})
	cover_art_image_url?: string | null;

	@TypeGraphQL.Field((_type) => String, {
		nullable: false,
	})
	episode_type!: string;

	@TypeGraphQL.Field((_type) => Boolean, {
		nullable: true,
	})
	clean_content?: boolean | null;

	@TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
		nullable: true,
	})
	season_number?: number | null;

	@TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
		nullable: true,
	})
	episode_number?: number | null;

	episode?: Episode;

	@TypeGraphQL.Field((_type) => String, {
		nullable: false,
	})
	episodeCuid!: string;
}
