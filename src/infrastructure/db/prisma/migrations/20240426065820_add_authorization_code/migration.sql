-- CreateTable
CREATE TABLE `AuthorizationCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `AuthorizationCode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuthorizationCode` ADD CONSTRAINT `AuthorizationCode_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`clientId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthorizationCode` ADD CONSTRAINT `AuthorizationCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
