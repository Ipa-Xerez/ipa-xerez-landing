CREATE TABLE `facebook_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`facebook_post_id` varchar(255),
	`share_status` enum('pending','scheduled','shared','failed') NOT NULL DEFAULT 'pending',
	`scheduled_for` timestamp,
	`shared_at` timestamp,
	`error_message` text,
	`auto_share` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `facebook_shares_id` PRIMARY KEY(`id`)
);
