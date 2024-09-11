CREATE TABLE IF NOT EXISTS "recipe" (
	"id" uuid PRIMARY KEY NOT NULL,
	"creted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"prep_time" text NOT NULL,
	"cook_time" text NOT NULL,
	"price_range" text NOT NULL,
	"video_link" text NOT NULL,
	"ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"flags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"author_id" uuid NOT NULL,
	CONSTRAINT "recipe_title_unique" UNIQUE("title"),
	CONSTRAINT "recipe_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe" ADD CONSTRAINT "recipe_author_id_profile_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
