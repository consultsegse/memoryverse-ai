ALTER TABLE `notifications` MODIFY COLUMN `type` enum('memory_completed','memory_failed','new_like','new_comment','payment_success','payment_failed','system','welcome','milestone','promotion') NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD `imageUrl` text;--> statement-breakpoint
ALTER TABLE `notifications` ADD `actionUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `notifications` ADD `actionLabel` varchar(100);--> statement-breakpoint
ALTER TABLE `notifications` ADD `priority` enum('low','normal','high','urgent') DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD `readAt` timestamp;--> statement-breakpoint
ALTER TABLE `notifications` ADD `scheduledFor` timestamp;--> statement-breakpoint
ALTER TABLE `notifications` ADD `sentAt` timestamp;--> statement-breakpoint
ALTER TABLE `notifications` ADD `emailSent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD `emailSentAt` timestamp;