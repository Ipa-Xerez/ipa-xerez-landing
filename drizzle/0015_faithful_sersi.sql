CREATE TABLE `document_downloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`document_id` int NOT NULL,
	`member_id` int NOT NULL,
	`member_name` varchar(255) NOT NULL,
	`member_email` varchar(320) NOT NULL,
	`downloaded_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_downloads_id` PRIMARY KEY(`id`)
);
