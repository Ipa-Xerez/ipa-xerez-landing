CREATE TABLE `facebook_engagement_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`facebook_share_id` int NOT NULL,
	`facebook_post_id` varchar(255) NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`comments` int NOT NULL DEFAULT 0,
	`shares` int NOT NULL DEFAULT 0,
	`reactions` text,
	`last_updated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `facebook_engagement_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `facebook_webhook_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_type` varchar(100) NOT NULL,
	`facebook_post_id` varchar(255) NOT NULL,
	`event_data` text NOT NULL,
	`processed` tinyint NOT NULL DEFAULT 0,
	`error_message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `facebook_webhook_events_id` PRIMARY KEY(`id`)
);
