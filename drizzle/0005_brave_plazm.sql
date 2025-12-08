ALTER TABLE `users` MODIFY COLUMN `plan` enum('free','starter','creator','pro','business','enterprise','agency') NOT NULL DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` ADD `planInterval` enum('monthly','annual') DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','cancelled','past_due','unpaid');--> statement-breakpoint
ALTER TABLE `users` ADD `currentPeriodEnd` timestamp;