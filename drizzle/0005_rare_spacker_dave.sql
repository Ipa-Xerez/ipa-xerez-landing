CREATE TABLE `newsletter_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaign_id` int NOT NULL,
	`subscriber_id` int NOT NULL,
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_opens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaign_id` int NOT NULL,
	`subscriber_id` int NOT NULL,
	`openedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_opens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `newsletter_campaigns` ADD `openCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `newsletter_campaigns` ADD `clickCount` int DEFAULT 0;