/*
  Warnings:

  - You are about to drop the column `audio_length` on the `episodeprofile` table. All the data in the column will be lost.
  - Added the required column `audio_duration` to the `EpisodeProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `episodeprofile` DROP COLUMN `audio_length`,
    ADD COLUMN     `audio_duration` VARCHAR(191) NOT NULL;
