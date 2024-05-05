-- AlterTable
ALTER TABLE `Room` ADD COLUMN `currentUserCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `maximum` INTEGER NULL;
