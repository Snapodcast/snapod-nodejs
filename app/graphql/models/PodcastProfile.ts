import { ObjectType, Field } from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Podcast } from "./Podcast";

@ObjectType({
	isAbstract: true,
})
export class PodcastProfile {
	@Field((_type) => GraphQLScalars.BigIntResolver, {
		nullable: false,
	})
	id!: bigint;

	@Field((_type) => String, {
		nullable: false,
	})
	cover_art_image_url!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	category_name!: string;

	@Field((_type) => String, {
		nullable: false,
	})
	language!: string;

	@Field((_type) => Boolean, {
		nullable: false,
	})
	clean_content!: boolean;

	@Field((_type) => String, {
		nullable: true,
	})
	apple_podcasts_code?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	apple_podcasts_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	google_podcasts_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	breaker_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	castbox_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	overcast_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	pocketcast_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	radiopublic_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	spotify?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	netease_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	qqmusic_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	ximalaya_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	xiaoyuzhou_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	website_url?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	copyright?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	ownerName?: string | null;

	@Field((_type) => String, {
		nullable: true,
	})
	ownerEmail?: string | null;

	@Field((_type) => Boolean, {
		nullable: true,
	})
	block?: boolean | null;

	@Field((_type) => Boolean, {
		nullable: true,
	})
	complete?: boolean | null;

	@Field((_type) => String, {
		nullable: true,
	})
	new_feed_url?: string | null;

	podcast?: Podcast;

	@Field((_type) => String, {
		nullable: false,
	})
	podcastCuid!: string;

	@Field((_type) => String, {
		nullable: true,
	})
	snapod_site_url: string;

	@Field((_type) => String, {
		nullable: true,
	})
	snapod_site_custom_url: string;

	@Field((_type) => String, {
		nullable: true,
	})
	snapod_site_theme: string;
}
