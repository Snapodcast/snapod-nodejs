/*
  Warnings:

  - A unique constraint covering the columns `[snapod_site_url]` on the table `PodcastProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[snapod_site_custom_url]` on the table `PodcastProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `podcastprofile` ADD COLUMN     `snapod_site_url` VARCHAR(191),
    ADD COLUMN     `snapod_site_custom_url` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `PodcastProfile.snapod_site_url_unique` ON `PodcastProfile`(`snapod_site_url`);

-- CreateIndex
CREATE UNIQUE INDEX `PodcastProfile.snapod_site_custom_url_unique` ON `PodcastProfile`(`snapod_site_custom_url`);
