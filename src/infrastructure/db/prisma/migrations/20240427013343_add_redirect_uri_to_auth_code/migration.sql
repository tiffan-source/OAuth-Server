/*
  Warnings:

  - Added the required column `redirectUriId` to the `AuthorizationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AuthorizationCode` ADD COLUMN `redirectUriId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `AuthorizationCode` ADD CONSTRAINT `AuthorizationCode_redirectUriId_fkey` FOREIGN KEY (`redirectUriId`) REFERENCES `RedirectUri`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
