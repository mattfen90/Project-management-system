-- CreateTable
CREATE TABLE `UserRolesTable` (
    `UserRoleID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserRoleName` VARCHAR(100) NOT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserRolesTable_UserRoleName_key`(`UserRoleName`),
    PRIMARY KEY (`UserRoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTable` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserRoleID` INTEGER NOT NULL,
    `Username` VARCHAR(100) NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `EmailVerified` BOOLEAN NOT NULL DEFAULT false,
    `EmailVerificationToken` VARCHAR(255) NULL,
    `EmailVerificationTokenExpiry` DATETIME(3) NULL,
    `PasswordResetToken` VARCHAR(255) NULL,
    `PasswordResetTokenExpiry` DATETIME(3) NULL,
    `FailedLoginAttempts` INTEGER NOT NULL DEFAULT 0,
    `LockedUntil` DATETIME(3) NULL,
    `LastLoginAt` DATETIME(3) NULL,
    `LastPasswordChangeAt` DATETIME(3) NULL,
    `TwoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    `TwoFactorSecret` VARCHAR(255) NULL,
    `AccountStatus` VARCHAR(50) NOT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedat` DATETIME(3) NOT NULL,
    `deletedat` DATETIME(3) NULL,

    UNIQUE INDEX `UserTable_Username_key`(`Username`),
    UNIQUE INDEX `UserTable_Email_key`(`Email`),
    INDEX `UserTable_UserRoleID_idx`(`UserRoleID`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLoginTable` (
    `UserLoginID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LoginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `IPAddress` VARCHAR(100) NOT NULL,
    `Success` BOOLEAN NOT NULL,
    `UserAgent` VARCHAR(255) NULL,
    `SessionToken` VARCHAR(500) NULL,
    `LogoutTime` DATETIME(3) NULL,
    `DeviceInfo` TEXT NULL,
    `FailureReason` VARCHAR(255) NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserLoginTable_UserID_idx`(`UserID`),
    PRIMARY KEY (`UserLoginID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserTable` ADD CONSTRAINT `UserTable_UserRoleID_fkey` FOREIGN KEY (`UserRoleID`) REFERENCES `UserRolesTable`(`UserRoleID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLoginTable` ADD CONSTRAINT `UserLoginTable_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `UserTable`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;
