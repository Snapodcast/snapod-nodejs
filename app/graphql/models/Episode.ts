import { ObjectType, Field } from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { EpisodeProfile } from "./EpisodeProfile";
import { Podcast } from "./Podcast";

@ObjectType({
	isAbstract: true,
})
export class Episode {
	@Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	id!: bigint;

	@Field((_type) => Date, {
		nullable: false,
	})
	createdAt!: Date;

	@Field((_type) => Date, {
		nullable: false,
	})
	updatedAt!: Date;

	@Field((_type) => String, {
		nullable: false,
	})
	title!: string;

	@Field((_type) => String, {
		nullable: true,
	})
	content?: string | null;

	@Field((_type) => Boolean, {
		nullable: false,
	})
	published!: boolean;

	podcast?: Podcast;

	profile?: EpisodeProfile | null;
}
