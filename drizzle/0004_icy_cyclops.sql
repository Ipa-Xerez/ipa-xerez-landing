CREATE TABLE `unsubscribe_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriber_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `unsubscribe_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `unsubscribe_tokens_token_unique` UNIQUE(`token`)
);
