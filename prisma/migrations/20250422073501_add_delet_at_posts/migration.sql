-- AlterTable
ALTER TABLE `comments` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `deletedAt` DATETIME(3) NULL;
