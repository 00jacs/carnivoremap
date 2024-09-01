// load function to fetch all the recipes from supabase
export async function load({ locals: { supabase } }) {
	const { data: recipes, error } = await supabase.from('recipes').select();

	console.log('recipes: ', recipes);
	console.log('error: ', error);

	if (error) {
		return {
			status: 500,
			error: error.message
		};
	} else {
		return {
			status: 200,
			recipes
		};
	}
}
