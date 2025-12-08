CREATE TABLE `memories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`story` text NOT NULL,
	`format` enum('video','music','book','podcast','animation','nft') NOT NULL,
	`status` enum('processing','completed','failed') NOT NULL DEFAULT 'processing',
	`isPublic` boolean NOT NULL DEFAULT false,
	`videoUrl` text,
	`musicUrl` text,
	`bookUrl` text,
	`podcastUrl` text,
	`animationUrl` text,
	`nftUrl` text,
	`thumbnailUrl` text,
	`views` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`shares` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `plan` enum('free','creator','pro') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `creditsRemaining` int DEFAULT 3 NOT NULL;