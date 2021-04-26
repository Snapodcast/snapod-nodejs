/*
  Warnings:

  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(64)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `password` CHAR(64) NOT NULL;
