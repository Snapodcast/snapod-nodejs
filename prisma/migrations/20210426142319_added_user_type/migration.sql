/*
  Warnings:

  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN     `salt` CHAR(8) NOT NULL;
