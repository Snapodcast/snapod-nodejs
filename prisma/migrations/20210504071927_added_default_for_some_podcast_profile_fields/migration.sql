/*
  Warnings:

  - You are about to alter the column `language` on the `podcastprofile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE `podcastprofile` MODIFY `language` VARCHAR(5) NOT NULL,
    MODIFY `block` BOOLEAN DEFAULT false,
    MODIFY `complete` BOOLEAN DEFAULT false;
