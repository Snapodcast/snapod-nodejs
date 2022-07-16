/*
  Warnings:

  - Made the column `description` on table `podcast` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `podcast` MODIFY `description` TEXT NOT NULL;
