import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profile', {
	id: uuid('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),

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
	createdAt: timestamp('created_at').defaultNow().notNull(),
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

export const placeReviews = pgTable('place_review', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),

	content: text('content').notNull(),
	rating: text('rating').notNull(),

	// meat rating
	// raw dairy rating
	// seafood rating

	authorID: uuid('author_id')
		.notNull()
		.references(() => profiles.id),
	placeID: uuid('place_id')
		.notNull()
		.references(() => places.id)
});

/**
 * - there should not be a possibility to remove the place if there are any reviews (only through reporting)
 */
export const places = pgTable('place', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),

	name: text('name').notNull(),
	slug: text('slug').notNull().unique(), // a little bit from 'name' and a little bit random

	authorID: uuid('author_id')
		.notNull()
		.references(() => profiles.id)
});
