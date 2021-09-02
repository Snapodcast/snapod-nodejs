import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class VoidOutput {
	@Field({
		description: "Void return status",
		nullable: false,
	})
	public status: boolean;

	@Field({
		description: "Void return message",
		nullable: false,
	})
	public message: string;

	@Field({
		description: "Void return name",
		nullable: true,
	})
	public name: string;
}

@ObjectType()
class PodcastPreview {
	@Field({
		description: "Podcast name",
		nullable: true,
	})
	name?: string

	@Field({
		description: "Podcast description",
		nullable: true,
	})
	description?: string

	@Field({
		description: "Podcast author",
		nullable: true,
	})
	author?: string
}

@ObjectType()
class ProfilePreview {
	@Field({
		description: "Podcast cover art image url",
		nullable: true,
	})
	cover_art_image_url?: string

	@Field({
		description: "Podcast primary category name",
		nullable: true,
	})
	category_name?: string

	@Field({
		description: "Podcast language",
		nullable: true,
	})
	language?: string

	@Field({
		description: "Podcast clean content indicator",
		nullable: true,
	})
	clean_content?: boolean

	@Field({
		description: "Podcast website url",
		nullable: true,
	})
	website_url?: string

	@Field({
		description: "Podcast copyright info",
		nullable: true,
	})
	copyright?: string

	@Field({
		description: "Podcast owner name",
		nullable: true,
	})
	ownerName?: string

	@Field({
		description: "Podcast owner email",
		nullable: true,
	})
	ownerEmail?: string
}

@ObjectType()
class EpisodePreview {
	@Field({
		description: "Episode title",
		nullable: true,
	})
	title?: string

	@Field({
		description: "Episode content",
		nullable: true,
	})
	content?: string
}

@ObjectType()
class EpisodeProfilePreview {
	@Field({
		description: "Episode audio url",
		nullable: true,
	})
	audio_url?: string

	@Field({
		description: "Episode audio size",
		nullable: true,
	})
	audio_size?: number

	@Field({
		description: "Episode cover art image url",
		nullable: true,
	})
	cover_art_image_url?: string

	@Field({
		description: "Episode clean content indicator",
		nullable: true,
	})
	clean_content?: boolean

	@Field({
		description: "Episode number",
		nullable: true,
	})
	episode_number?: number
}

@ObjectType()
class PreviewEpisode {
	@Field({
		description: "Episode info",
		nullable: false,
	})
	public episode: EpisodePreview

	@Field({
		description: "Episode profile info",
		nullable: false
	})
	public profile: EpisodeProfilePreview
}

@ObjectType()
export class Preview {
	@Field({
		description: "Podcast info",
		nullable: false,
	})
	public podcast: PodcastPreview

	@Field({
		description: "Podcast profile info",
		nullable: false
	})
	public profile: ProfilePreview

	@Field(type => [PreviewEpisode])
	public episodes: PreviewEpisode[]
}
