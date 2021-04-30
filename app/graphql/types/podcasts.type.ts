import { ArgsType, InputType, Field, ObjectType } from "type-graphql";

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

	@Field({
		description: "Podcast copyright",
		nullable: true,
	})
	public copyright: string;

	@Field({
		description: "Podcast owner name",
		nullable: true,
	})
	public ownerName: string;

	@Field({
		description: "Podcast owner email",
		nullable: true,
	})
	public ownerEmail: string;
}

@InputType()
export class PodcastInput {
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

	@Field({
		description: "Podcast type",
		nullable: false,
	})
	public type: string;

	@Field(() => PodcastProfileInput, {
		description: "Podcast profile",
		nullable: false,
	})
	public profile: {
		language: string;
		category: string;
		contentClean: boolean;
		coverImageUrl: string;
		copyright?: string;
		ownerName?: string;
		ownerEmail?: string;
	};
}

@InputType()
export class ModifyInfoInput {
	@Field({
		description: "Podcast name",
		nullable: true,
	})
	public name?: string;

	@Field({
		description: "Podcast description",
		nullable: true,
	})
	public description?: string;

	@Field({
		description: "Podcast type",
		nullable: true,
	})
	public type: string;
}

@InputType()
export class ModifyProfileInput {
	@Field({
		description: "Podcast language",
		nullable: true,
	})
	public language?: string;

	@Field({
		description: "Podcast category name",
		nullable: true,
	})
	public category_name?: string;

	@Field({
		description: "Podcast content type",
		nullable: true,
	})
	public clean_content?: boolean;

	@Field({
		description: "Podcast cover art url",
		nullable: true,
	})
	public cover_art_image_url: string;

	@Field((_type) => String, {
		description: "Podcast Apple Podcasts Code",
		nullable: true,
	})
	apple_podcasts_code?: string | null;

	@Field((_type) => String, {
		description: "Podcast Apple Podcasts URL",
		nullable: true,
	})
	apple_podcasts_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Google Podcasts URL",
		nullable: true,
	})
	google_podcasts_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Breaker URL",
		nullable: true,
	})
	breaker_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast CastBox URL",
		nullable: true,
	})
	castbox_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Overcast URL",
		nullable: true,
	})
	overcast_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast PocketCast URL",
		nullable: true,
	})
	pocketcast_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast RadioPublic URL",
		nullable: true,
	})
	radiopublic_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Spotify URL",
		nullable: true,
	})
	spotify?: string | null;

	@Field((_type) => String, {
		description: "Podcast Netease Music URL",
		nullable: true,
	})
	netease_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast QQ Music URL",
		nullable: true,
	})
	qqmusic_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Ximalaya URL",
		nullable: true,
	})
	ximalaya_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Xiaoyuzhou URL",
		nullable: true,
	})
	xiaoyuzhou_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast Website URL",
		nullable: true,
	})
	website_url?: string | null;

	@Field((_type) => String, {
		description: "Podcast copyright",
		nullable: true,
	})
	public copyright?: string;

	@Field((_type) => String, {
		description: "Podcast owner name",
		nullable: true,
	})
	public ownerName?: string;

	@Field((_type) => String, {
		description: "Podcast owner email",
		nullable: true,
	})
	public ownerEmail?: string;

	@Field((_type) => String, {
		description: "Podcast copyright",
		nullable: true,
	})
	public block?: boolean;

	@Field((_type) => String, {
		description: "Podcast copyright",
		nullable: true,
	})
	public complete?: boolean;
}
