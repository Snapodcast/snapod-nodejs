import { ObjectType, Field } from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Podcast } from "./Podcast";
import { UserProfile } from "./UserProfile";

@ObjectType({
	isAbstract: true,
})
export class User {
	@Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	id!: bigint;

	@Field((_type) => String, {
		nullable: false,
	})
	name!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	cuid!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	email!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	password!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	salt!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	type!: string;

	podcasts?: Podcast[];

	profile?: UserProfile | null;
}
