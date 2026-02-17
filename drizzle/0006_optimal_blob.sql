CREATE TABLE `newsletter_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`frequency` enum('daily','weekly','biweekly','monthly') NOT NULL,
	`dayOfWeek` int,
	`hour` int NOT NULL,
	`minute` int DEFAULT 0,
	`timezone` varchar(50) NOT NULL DEFAULT 'Europe/Madrid',
	`isActive` tinyint NOT NULL DEFAULT 1,
	`lastSentAt` timestamp,
	`nextSendAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletter_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schedule_id` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`includeEvents` tinyint NOT NULL DEFAULT 1,
	`includePhotos` tinyint NOT NULL DEFAULT 1,
	`includeBlog` tinyint NOT NULL DEFAULT 1,
	`maxEvents` int DEFAULT 5,
	`maxPhotos` int DEFAULT 10,
	`maxBlogPosts` int DEFAULT 3,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletter_templates_id` PRIMARY KEY(`id`)
);
