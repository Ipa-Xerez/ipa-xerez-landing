CREATE TABLE `benefit_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`image_url` text NOT NULL,
	`image_key` varchar(255) NOT NULL,
	`description` text,
	`position` int NOT NULL DEFAULT 0,
	`is_active` tinyint NOT NULL DEFAULT 1,
	`uploaded_by` int,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `benefit_images_id` PRIMARY KEY(`id`)
);
