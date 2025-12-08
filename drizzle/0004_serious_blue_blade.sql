CREATE TABLE `affiliateCommissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`referralId` int NOT NULL,
	`orderId` varchar(255),
	`type` enum('first_sale','recurring','bonus') NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliateCommissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliateReferrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`status` enum('pending','converted','cancelled') NOT NULL DEFAULT 'pending',
	`firstPurchaseAt` timestamp,
	`lastPurchaseAt` timestamp,
	`totalSpent` int NOT NULL DEFAULT 0,
	`totalCommission` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliateReferrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(32) NOT NULL,
	`status` enum('pending','active','suspended','banned') NOT NULL DEFAULT 'pending',
	`tier` enum('standard','silver','gold','platinum') NOT NULL DEFAULT 'standard',
	`commissionRate` int NOT NULL DEFAULT 30,
	`recurringCommissionRate` int NOT NULL DEFAULT 10,
	`totalEarnings` int NOT NULL DEFAULT 0,
	`pendingEarnings` int NOT NULL DEFAULT 0,
	`paidEarnings` int NOT NULL DEFAULT 0,
	`totalReferrals` int NOT NULL DEFAULT 0,
	`activeReferrals` int NOT NULL DEFAULT 0,
	`pixKey` varchar(255),
	`lastPayoutAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `affiliates_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `creditPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`credits` int NOT NULL,
	`amount` int NOT NULL,
	`paymentMethod` varchar(50),
	`stripePaymentIntentId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creditPurchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL,
	`type` enum('earned','redeemed','expired','bonus') NOT NULL,
	`reason` varchar(255) NOT NULL,
	`referenceId` int,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyPoints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `premiumTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('video_style','music_style','book_template','voice','bundle') NOT NULL,
	`price` int NOT NULL,
	`thumbnailUrl` text,
	`previewUrl` text,
	`config` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`salesCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `premiumTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`code` varchar(32) NOT NULL,
	`status` enum('pending','completed','rewarded') NOT NULL DEFAULT 'pending',
	`rewardType` enum('credits','discount','free_month'),
	`rewardAmount` int,
	`rewardedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templatePurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`templateId` int NOT NULL,
	`amount` int NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templatePurchases_id` PRIMARY KEY(`id`)
);
