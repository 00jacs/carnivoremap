import { redirect } from '@sveltejs/kit';

// load function to fetch all the recipes from supabase
export async function load({ locals: { supabase } }) {
	// @todo: switch to backend filtering & pagination
	const { data: recipes, error } = await supabase
		.from('recipes')
		.select(
			'id, title, description, cook_time, prep_time, price_range, user_id, ingredients, flags, slug, profiles(id, first_name, username)'
		);

	console.log('recipes: ', recipes);
	console.log('error: ', error);

	if (error) {
		return redirect(500, '/error');
	} else {
		return {
			status: 200,
			recipes
		};
	}
}
