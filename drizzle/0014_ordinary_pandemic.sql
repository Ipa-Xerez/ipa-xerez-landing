CREATE TABLE `ipa_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`member_number` varchar(20) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`join_date` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ipa_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `ipa_members_member_number_unique` UNIQUE(`member_number`)
);
--> statement-breakpoint
CREATE TABLE `member_access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`member_id` int NOT NULL,
	`document_id` int NOT NULL,
	`accessed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `member_access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `private_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`document_type` varchar(50) NOT NULL,
	`file_url` text NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`uploaded_by` int,
	`is_public` tinyint NOT NULL DEFAULT 0,
	`view_count` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `private_documents_id` PRIMARY KEY(`id`)
);
