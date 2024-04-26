/*
  Warnings:

  - You are about to drop the column `responseTypes` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `responseTypes`;

-- CreateTable
CREATE TABLE `GrantType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GrantType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrantTypeOnClient` (
    `clientId` VARCHAR(191) NOT NULL,
    `grantTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`clientId`, `grantTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GrantTypeOnClient` ADD CONSTRAINT `GrantTypeOnClient_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`clientId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrantTypeOnClient` ADD CONSTRAINT `GrantTypeOnClient_grantTypeId_fkey` FOREIGN KEY (`grantTypeId`) REFERENCES `GrantType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
