CREATE TABLE IF NOT EXISTS "requestLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"ip" varchar(10),
	"hostname" varchar(256),
	"body" jsonb,
	"status_code" varchar(3),
	"duration_ms" varchar(10),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"user_agent" varchar(256),
	"online" boolean,
	"expire_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
