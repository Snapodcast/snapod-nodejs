import { MaxLength } from "class-validator";
import { ArgsType, InputType, Field, ObjectType } from "type-graphql";

@InputType()
class EpisodeProfileInput {
	@Field({
		description: "Episode audio file url",
		nullable: false,
	})
	public audio_url: string;

	@Field({
		description: "Episode audio duration string",
		nullable: false,
	})
	public audio_duration: string;

	@Field({
		description: "Episode audio size",
		nullable: false,
	})
	public audio_size: number;

	@Field({
		description: "Episode type",
		nullable: false,
	})
	public episode_type: string;

	@Field({
		description: "Episode content type",
		nullable: false,
	})
	public clean_content: boolean;

	@Field({
		description: "Episode cover art URL",
		nullable: true,
	})
	public cover_art_image_url?: string;

	@Field({
		description: "Episode season number",
		nullable: true,
	})
	public season_number?: number;

	@Field({
		description: "Episode number",
		nullable: true,
	})
	public episode_number?: number;
}

@InputType()
export class EpisodeInput {
	@Field({
		description: "Episode title",
		nullable: false,
	})
	@MaxLength(255)
	public title: string;

	@Field({
		description: "Episode content",
		nullable: false,
	})
	public content: string;

	@Field({
		description: "Episode publish status",
		nullable: true,
	})
	public published?: boolean;

	@Field(() => EpisodeProfileInput, {
		description: "Episode profile",
		nullable: false,
	})
	public profile: EpisodeProfileInput;
}

@InputType()
export class ModifyEpisodeInfoInput {
	@Field({
		description: "Episode title",
		nullable: true,
	})
	@MaxLength(255)
	public title?: string;

	@Field({
		description: "Episode content",
		nullable: true,
	})
	public content?: string;

	@Field({
		description: "Episode publish status",
		nullable: true,
	})
	public published?: boolean;
}

@InputType()
export class ModifyEpisodeProfileInput {
	@Field({
		description: "Episode audio file url",
		nullable: true,
	})
	public audio_url?: string;

	@Field({
		description: "Episode audio duration string",
		nullable: true,
	})
	public audio_duration?: string;

	@Field({
		description: "Episode audio size",
		nullable: true,
	})
	public audio_size?: number;

	@Field({
		description: "Episode cover art URL",
		nullable: true,
	})
	public cover_art_image_url?: string;

	@Field({
		description: "Episode type",
		nullable: true,
	})
	public episode_type?: string;

	@Field({
		description: "Episode content type",
		nullable: true,
	})
	public clean_content?: boolean;

	@Field({
		description: "Episode season number",
		nullable: true,
	})
	public season_number?: number;

	@Field({
		description: "Episode number",
		nullable: true,
	})
	public episode_number?: number;
}
