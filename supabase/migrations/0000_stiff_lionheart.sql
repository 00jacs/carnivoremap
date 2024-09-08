CREATE TABLE IF NOT EXISTS "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "profile_email_unique" UNIQUE("email"),
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);

ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
