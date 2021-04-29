import { ArgsType, InputType, Field, ObjectType } from "type-graphql";

@InputType()
class EpisodeProfileInput {
	@Field({
		description: "Episode audio file url",
		nullable: false,
	})
	public audio_url: string;

	@Field({
		description: "Episode audio length",
		nullable: false,
	})
	public audio_length: number;

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
}

@InputType()
export class EpisodeInput {
	@Field({
		description: "Episode title",
		nullable: false,
	})
	public title: string;

	@Field({
		description: "Episode content",
		nullable: false,
	})
	public content: string;

	@Field(() => EpisodeProfileInput, {
		description: "Episode profile",
		nullable: false,
	})
	public profile: {
		audio_url: string;
		audio_length: number;
		audio_size: number;
		episode_type: string;
		clean_content: boolean;
	};
}

@InputType()
export class ModifyEpisodeInfoInput {
	@Field({
		description: "Episode title",
		nullable: true,
	})
	public title?: string;

	@Field({
		description: "Episode content",
		nullable: true,
	})
	public content?: string;
}

@InputType()
export class ModifyEpisodeProfileInput {
	@Field({
		description: "Episode audio file url",
		nullable: true,
	})
	public audio_url?: string;

	@Field({
		description: "Episode audio length",
		nullable: true,
	})
	public audio_length?: number;

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
