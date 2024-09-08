import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profile', {
	id: uuid('id').primaryKey(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique()
});

export const RECIPE_FLAGS = ['beef', 'pork', 'chicken', 'seafood', 'dairy-free'];
export type RecipeFlag = 'beef' | 'pork' | 'chicken' | 'seafood' | 'dairy-free';

export interface RecipeIngredient {
	name: string;
	quantity: string;
}

export const recipes = pgTable('recipe', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('creted_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),

	title: text('title').unique().notNull(),
	slug: text('slug').unique().notNull(),
	description: text('description').notNull(),
	content: text('content').notNull(),
	prepTime: text('prep_time').notNull(),
	cookTime: text('cook_time').notNull(),
	priceRange: text('price_range').notNull(),
	videoLink: text('video_link'),

	ingredients: jsonb('ingredients')
		.$type<RecipeIngredient[]>()
		.notNull()
		.default(sql`'[]'::jsonb`),
	flags: text('flags')
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`), // RECIPE_FLAGS

	authorID: uuid('author_id')
		.notNull()
		.references(() => profiles.id)
});
