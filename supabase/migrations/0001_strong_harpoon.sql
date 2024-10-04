CREATE TABLE IF NOT EXISTS "place" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"title" text,
	"description" text,
	"street_address" text,
	"street_number" text,
	"postal_code" text,
	"city" text,
	"country" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
