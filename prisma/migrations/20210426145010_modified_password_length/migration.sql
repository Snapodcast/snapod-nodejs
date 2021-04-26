/*
  Warnings:

  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Char(64)` to `Char(32)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `password` CHAR(32) NOT NULL;
