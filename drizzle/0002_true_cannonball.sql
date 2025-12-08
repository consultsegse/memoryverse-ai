CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailMemoryCompleted` boolean NOT NULL DEFAULT true,
	`emailNewLike` boolean NOT NULL DEFAULT false,
	`emailNewComment` boolean NOT NULL DEFAULT true,
	`emailPayment` boolean NOT NULL DEFAULT true,
	`pushMemoryCompleted` boolean NOT NULL DEFAULT true,
	`pushNewLike` boolean NOT NULL DEFAULT false,
	`pushNewComment` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificationPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('memory_completed','memory_failed','new_like','new_comment','payment_success','payment_failed','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`link` varchar(500),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
