import { ObjectType, Field } from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Episode } from "./Episode";
import { PodcastProfile } from "./PodcastProfile";
import { User } from "./User";

@ObjectType({
	isAbstract: true,
})
export class Podcast {
	@Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	id!: bigint;

	@Field((_type) => String, {
		nullable: false,
	})
	cuid!: string;

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
	name!: string;

	@Field((_type) => String, {
		nullable: true,
	})
	description?: string | null;

	@Field((_type) => Boolean, {
		nullable: false,
	})
	published!: boolean;

	author: User;

	@Field((_type) => String, {
		nullable: false,
	})
	authorCuid!: string;

	profile?: PodcastProfile | null;

	episodes?: Episode[];
}
