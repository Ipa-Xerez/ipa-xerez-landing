CREATE TABLE `event_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`user_id` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`status` enum('registered','confirmed','cancelled','attended') NOT NULL DEFAULT 'registered',
	`registered_at` timestamp NOT NULL DEFAULT (now()),
	`confirmed_at` timestamp,
	`cancelled_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_registrations_id` PRIMARY KEY(`id`)
);
