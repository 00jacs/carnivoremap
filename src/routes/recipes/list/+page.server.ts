import { redirect } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';

import { eq } from 'drizzle-orm';
import { db, profiles, recipes } from '$lib/db';

// load function to fetch all the recipes from supabase with drizzle-orm
export async function load() {
	// @todo: switch to backend filtering & pagination

	logger.info('[recipes/list] Fetching all recipes from the database.');

	try {
		const allRecipes = await db
			.select({
				id: recipes.id,
				title: recipes.title,
				slug: recipes.slug,
				description: recipes.description,
				prepTime: recipes.prepTime,
				cookTime: recipes.cookTime,
				priceRange: recipes.priceRange,
				ingredients: recipes.ingredients,
				flags: recipes.flags,
				profiles: {
					id: profiles.id,
					username: profiles.username
				}
			})
			.from(recipes)
			.leftJoin(profiles, eq(recipes.authorID, profiles.id))
			.execute();

		logger.success('[recipes/list] Recipes have been fetched successfully.');
		return {
			status: 200,
			recipes: allRecipes
		};
	} catch (e) {
		logger.error('[recipes/list] Error occurred while fetching recipes: ', e);
		return redirect(500, '/error');
	}
}
