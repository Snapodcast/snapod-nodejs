-- CreateTable
CREATE TABLE `Podcast` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(191),
    `published` BOOLEAN NOT NULL DEFAULT false,
    `authorCuid` VARCHAR(191) NOT NULL,
UNIQUE INDEX `Podcast.cuid_unique`(`cuid`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PodcastProfile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cover_art_image_url` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `clean_content` BOOLEAN NOT NULL,
    `apple_podcasts_code` VARCHAR(191),
    `apple_podcasts_url` VARCHAR(191),
    `google_podcasts_url` VARCHAR(191),
    `breaker_url` VARCHAR(191),
    `castbox_url` VARCHAR(191),
    `overcast_url` VARCHAR(191),
    `pocketcast_url` VARCHAR(191),
    `radiopublic_url` VARCHAR(191),
    `spotify` VARCHAR(191),
    `netease_url` VARCHAR(191),
    `qqmusic_url` VARCHAR(191),
    `ximalaya_url` VARCHAR(191),
    `xiaoyuzhou_url` VARCHAR(191),
    `website_url` VARCHAR(191),
    `podcastCuid` VARCHAR(191),
UNIQUE INDEX `PodcastProfile.apple_podcasts_url_unique`(`apple_podcasts_url`),
UNIQUE INDEX `PodcastProfile.google_podcasts_url_unique`(`google_podcasts_url`),
UNIQUE INDEX `PodcastProfile.breaker_url_unique`(`breaker_url`),
UNIQUE INDEX `PodcastProfile.castbox_url_unique`(`castbox_url`),
UNIQUE INDEX `PodcastProfile.overcast_url_unique`(`overcast_url`),
UNIQUE INDEX `PodcastProfile.pocketcast_url_unique`(`pocketcast_url`),
UNIQUE INDEX `PodcastProfile.radiopublic_url_unique`(`radiopublic_url`),
UNIQUE INDEX `PodcastProfile.spotify_unique`(`spotify`),
UNIQUE INDEX `PodcastProfile.netease_url_unique`(`netease_url`),
UNIQUE INDEX `PodcastProfile.qqmusic_url_unique`(`qqmusic_url`),
UNIQUE INDEX `PodcastProfile.ximalaya_url_unique`(`ximalaya_url`),
UNIQUE INDEX `PodcastProfile.xiaoyuzhou_url_unique`(`xiaoyuzhou_url`),
UNIQUE INDEX `PodcastProfile.podcastCuid_unique`(`podcastCuid`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EpisodeProfile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `audio_url` VARCHAR(191) NOT NULL,
    `audio_length` INTEGER NOT NULL,
    `audio_size` INTEGER NOT NULL,
    `cover_art_image_url` VARCHAR(191),
    `episode_type` VARCHAR(7) NOT NULL,
    `clean_content` BOOLEAN NOT NULL,
    `season_number` INTEGER,
    `episode_number` INTEGER,
    `episodeCuid` VARCHAR(191),
UNIQUE INDEX `EpisodeProfile.episodeCuid_unique`(`episodeCuid`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Episode` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `podcastCuid` VARCHAR(191) NOT NULL,
UNIQUE INDEX `Episode.cuid_unique`(`cuid`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cuid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` CHAR(44) NOT NULL,
    `salt` CHAR(12) NOT NULL,
    `type` VARCHAR(5) NOT NULL DEFAULT 'User',
    `name` VARCHAR(30) NOT NULL,
UNIQUE INDEX `User.cuid_unique`(`cuid`),
UNIQUE INDEX `User.email_unique`(`email`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recovery` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `code` CHAR(44) NOT NULL,
UNIQUE INDEX `Recovery.code_unique`(`code`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Podcast` ADD FOREIGN KEY (`authorCuid`) REFERENCES `User`(`cuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PodcastProfile` ADD FOREIGN KEY (`podcastCuid`) REFERENCES `Podcast`(`cuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EpisodeProfile` ADD FOREIGN KEY (`episodeCuid`) REFERENCES `Episode`(`cuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Episode` ADD FOREIGN KEY (`podcastCuid`) REFERENCES `Podcast`(`cuid`) ON DELETE CASCADE ON UPDATE CASCADE;
