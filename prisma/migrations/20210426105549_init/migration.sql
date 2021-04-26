-- CreateTable
CREATE TABLE `Podcast` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(191),
    `published` BOOLEAN NOT NULL DEFAULT false,

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
    `podcastId` BIGINT NOT NULL,
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
UNIQUE INDEX `PodcastProfile.podcastId_unique`(`podcastId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EpisodeProfile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `audio_url` VARCHAR(191) NOT NULL,
    `audio_length` INTEGER NOT NULL,
    `cover_art_image_url` VARCHAR(191),
    `episode_type` VARCHAR(7) NOT NULL,
    `clean_content` BOOLEAN,
    `season_number` INTEGER,
    `episode_number` INTEGER,
    `episodeId` BIGINT NOT NULL,
UNIQUE INDEX `EpisodeProfile.audio_url_unique`(`audio_url`),
UNIQUE INDEX `EpisodeProfile.episodeId_unique`(`episodeId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Episode` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` VARCHAR(191),
    `published` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191),
    `twitter_url` VARCHAR(191),
    `instagram_url` VARCHAR(191),
    `youtube_url` VARCHAR(191),
    `website_url` VARCHAR(191),
    `wechat` VARCHAR(191),
    `qq` VARCHAR(191),
    `userId` BIGINT NOT NULL,
UNIQUE INDEX `UserProfile.userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
UNIQUE INDEX `User.email_unique`(`email`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PodcastToUser` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,
UNIQUE INDEX `_PodcastToUser_AB_unique`(`A`, `B`),
INDEX `_PodcastToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EpisodeToPodcast` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,
UNIQUE INDEX `_EpisodeToPodcast_AB_unique`(`A`, `B`),
INDEX `_EpisodeToPodcast_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PodcastProfile` ADD FOREIGN KEY (`podcastId`) REFERENCES `Podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EpisodeProfile` ADD FOREIGN KEY (`episodeId`) REFERENCES `Episode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PodcastToUser` ADD FOREIGN KEY (`A`) REFERENCES `Podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PodcastToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EpisodeToPodcast` ADD FOREIGN KEY (`A`) REFERENCES `Episode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EpisodeToPodcast` ADD FOREIGN KEY (`B`) REFERENCES `Podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
