ALTER TABLE "users" ADD COLUMN "password_hash" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");