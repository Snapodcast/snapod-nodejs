-- AlterTable
ALTER TABLE `user` MODIFY `password` CHAR(44) NOT NULL,
    MODIFY `salt` CHAR(12) NOT NULL;
