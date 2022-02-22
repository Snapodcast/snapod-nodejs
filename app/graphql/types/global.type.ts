import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class VoidOutput {
	@Field(() => Boolean, {
		description: "Void return status",
		nullable: false,
	})
	public status: boolean;

	@Field(() => String, {
		description: "Void return message",
		nullable: false,
	})
	public message: string;

	@Field(() => String, {
		description: "Void return name",
		nullable: true,
	})
	public name: string;
}

@ObjectType()
class PodcastPreview {
	@Field(() => String, {
		description: "Podcast name",
		nullable: true,
	})
	name?: string;

	@Field(() => String, {
		description: "Podcast description",
		nullable: true,
	})
	description?: string;

	@Field(() => String, {
		description: "Podcast author",
		nullable: true,
	})
	author?: string;
}

@ObjectType()
class ProfilePreview {
	@Field(() => String, {
		description: "Podcast cover art image url",
		nullable: true,
	})
	cover_art_image_url?: string;

	@Field(() => String, {
		description: "Podcast primary category name",
		nullable: true,
	})
	category_name?: string;

	@Field(() => String, {
		description: "Podcast language",
		nullable: true,
	})
	language?: string;

	@Field(() => Boolean, {
		description: "Podcast clean content indicator",
		nullable: true,
	})
	clean_content?: boolean;

	@Field(() => String, {
		description: "Podcast website url",
		nullable: true,
	})
	website_url?: string;

	@Field(() => String, {
		description: "Podcast copyright info",
		nullable: true,
	})
	copyright?: string;

	@Field(() => String, {
		description: "Podcast owner name",
		nullable: true,
	})
	ownerName?: string;

	@Field(() => String, {
		description: "Podcast owner email",
		nullable: true,
	})
	ownerEmail?: string;
}

@ObjectType()
class EpisodePreview {
	@Field(() => String, {
		description: "Episode title",
		nullable: true,
	})
	title?: string;

	@Field(() => String, {
		description: "Episode content",
		nullable: true,
	})
	content?: string;
}

@ObjectType()
class EpisodeProfilePreview {
	@Field(() => String, {
		description: "Episode audio url",
		nullable: true,
	})
	audio_url?: string;

	@Field(() => Int, {
		description: "Episode audio size",
		nullable: true,
	})
	audio_size?: number;

	@Field(() => String, {
		description: "Episode cover art image url",
		nullable: true,
	})
	cover_art_image_url?: string;

	@Field(() => Boolean, {
		description: "Episode clean content indicator",
		nullable: true,
	})
	clean_content?: boolean;

	@Field(() => Int, {
		description: "Episode number",
		nullable: true,
	})
	episode_number?: number;
}

@ObjectType()
class PreviewEpisode {
	@Field(() => EpisodePreview, {
		description: "Episode info",
		nullable: false,
	})
	public episode: EpisodePreview;

	@Field(() => EpisodeProfilePreview, {
		description: "Episode profile info",
		nullable: false,
	})
	public profile: EpisodeProfilePreview;
}

@ObjectType()
export class Preview {
	@Field(() => PodcastPreview, {
		description: "Podcast info",
		nullable: false,
	})
	public podcast: PodcastPreview;

	@Field(() => ProfilePreview, {
		description: "Podcast profile info",
		nullable: false,
	})
	public profile: ProfilePreview;

	@Field(() => [PreviewEpisode])
	public episodes: PreviewEpisode[];
}
