import { redirect } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';

// load function to fetch all the recipes from supabase
export async function load({ locals: { supabase } }) {
	// @todo: switch to backend filtering & pagination

	logger.info('[recipes/list] Fetching all recipes from the database.');

	const { data: recipes, error } = await supabase
		.from('recipes')
		.select(
			'id, title, description, cook_time, prep_time, price_range, user_id, ingredients, flags, slug, profiles(id, username)'
		);

	if (error) {
		logger.error('[recipes/list] Error occurred while fetching recipes: ', error);
		return redirect(500, '/error');
	} else {
		logger.success('[recipes/list] Recipes have been fetched successfully.');
		return {
			status: 200,
			recipes
		};
	}
}
