CREATE TABLE `administrators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`permissions` varchar(255) NOT NULL DEFAULT 'blog,newsletter,events',
	`added_by` int,
	`added_at` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `administrators_id` PRIMARY KEY(`id`),
	CONSTRAINT `administrators_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `administrators_email_unique` UNIQUE(`email`)
);
