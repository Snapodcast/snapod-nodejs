-- CreateTable
CREATE TABLE "Podcast" (
    "id" BIGSERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type" VARCHAR(8) NOT NULL,
    "authorCuid" TEXT NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastProfile" (
    "id" BIGSERIAL NOT NULL,
    "cover_art_image_url" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "language" VARCHAR(5) NOT NULL,
    "clean_content" BOOLEAN NOT NULL,
    "apple_podcasts_code" TEXT,
    "apple_podcasts_url" TEXT,
    "google_podcasts_url" TEXT,
    "breaker_url" TEXT,
    "castbox_url" TEXT,
    "overcast_url" TEXT,
    "pocketcast_url" TEXT,
    "radiopublic_url" TEXT,
    "spotify" TEXT,
    "netease_url" TEXT,
    "qqmusic_url" TEXT,
    "ximalaya_url" TEXT,
    "xiaoyuzhou_url" TEXT,
    "website_url" TEXT,
    "copyright" TEXT,
    "ownerName" TEXT,
    "ownerEmail" TEXT,
    "block" BOOLEAN DEFAULT false,
    "complete" BOOLEAN DEFAULT false,
    "new_feed_url" TEXT,
    "snapod_site_url" TEXT,
    "snapod_site_custom_url" TEXT,
    "snapod_site_theme" TEXT DEFAULT E'default',
    "podcastCuid" TEXT,

    CONSTRAINT "PodcastProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodeProfile" (
    "id" BIGSERIAL NOT NULL,
    "audio_url" TEXT NOT NULL,
    "audio_duration" TEXT,
    "audio_size" INTEGER NOT NULL,
    "cover_art_image_url" TEXT,
    "episode_type" VARCHAR(7) NOT NULL,
    "clean_content" BOOLEAN NOT NULL,
    "season_number" INTEGER,
    "episode_number" INTEGER,
    "episodeCuid" TEXT,

    CONSTRAINT "EpisodeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" BIGSERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "podcastCuid" TEXT NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" CHAR(44) NOT NULL,
    "salt" CHAR(12) NOT NULL,
    "type" VARCHAR(5) NOT NULL DEFAULT E'User',
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recovery" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" CHAR(44) NOT NULL,

    CONSTRAINT "Recovery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_cuid_key" ON "Podcast"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_apple_podcasts_url_key" ON "PodcastProfile"("apple_podcasts_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_google_podcasts_url_key" ON "PodcastProfile"("google_podcasts_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_breaker_url_key" ON "PodcastProfile"("breaker_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_castbox_url_key" ON "PodcastProfile"("castbox_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_overcast_url_key" ON "PodcastProfile"("overcast_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_pocketcast_url_key" ON "PodcastProfile"("pocketcast_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_radiopublic_url_key" ON "PodcastProfile"("radiopublic_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_spotify_key" ON "PodcastProfile"("spotify");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_netease_url_key" ON "PodcastProfile"("netease_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_qqmusic_url_key" ON "PodcastProfile"("qqmusic_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_ximalaya_url_key" ON "PodcastProfile"("ximalaya_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_xiaoyuzhou_url_key" ON "PodcastProfile"("xiaoyuzhou_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_snapod_site_url_key" ON "PodcastProfile"("snapod_site_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_snapod_site_custom_url_key" ON "PodcastProfile"("snapod_site_custom_url");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProfile_podcastCuid_key" ON "PodcastProfile"("podcastCuid");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeProfile_episodeCuid_key" ON "EpisodeProfile"("episodeCuid");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_cuid_key" ON "Episode"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_cuid_key" ON "User"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recovery_code_key" ON "Recovery"("code");

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_authorCuid_fkey" FOREIGN KEY ("authorCuid") REFERENCES "User"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastProfile" ADD CONSTRAINT "PodcastProfile_podcastCuid_fkey" FOREIGN KEY ("podcastCuid") REFERENCES "Podcast"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeProfile" ADD CONSTRAINT "EpisodeProfile_episodeCuid_fkey" FOREIGN KEY ("episodeCuid") REFERENCES "Episode"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastCuid_fkey" FOREIGN KEY ("podcastCuid") REFERENCES "Podcast"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
