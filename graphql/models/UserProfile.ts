import { ObjectType, Field } from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { User } from "./User";

@ObjectType({
	isAbstract: true,
})
export class UserProfile {
	@Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	id!: bigint;

	@Field((_type) => String, {
		nullable: false,
	})
	name!: string;

	@Field((_type) => String, {
		nullable: true,
	})
	bio?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	twitter_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	instagram_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	youtube_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	website_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	wechat?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	qq?: string | null;

	user?: User;

	@Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	userId!: bigint;
}
