-- AlterTable
ALTER TABLE `AuthorizationCode` ADD COLUMN `codeChallenge` VARCHAR(191) NULL,
    ADD COLUMN `codeChallengeMethod` VARCHAR(191) NULL;
