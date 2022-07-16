/*
  Warnings:

  - You are about to drop the column `published` on the `podcast` table. All the data in the column will be lost.
  - Added the required column `type` to the `Podcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `podcast` DROP COLUMN `published`,
    ADD COLUMN     `type` VARCHAR(8) NOT NULL;

-- AlterTable
ALTER TABLE `podcastprofile` ADD COLUMN     `copyright` VARCHAR(191),
    ADD COLUMN     `ownerName` VARCHAR(191),
    ADD COLUMN     `ownerEmail` VARCHAR(191),
    ADD COLUMN     `block` BOOLEAN,
    ADD COLUMN     `complete` BOOLEAN,
    ADD COLUMN     `new_feed_url` VARCHAR(191);
