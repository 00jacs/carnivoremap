import { fail } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';

// @todo: add post analytics -> gamifying the process
// and showing people how many views, likes, etc. they have
// will be a good way to keep them engaged with the app long-term

export const load = async ({ params, locals: { supabase } }) => {
	logger.info('Looking for recipe slug: ', params.slug);

	const { data: recipe, error } = await supabase
		.from('recipes')
		.select()
		.eq('slug', params.slug)
		.single();

	if (error) {
		logger.error('Error fetching recipe', error);

		return fail(404, {
			message: 'Recipe not found'
		});
	}

	logger.success('Recipe found: ', recipe.id);

	return {
		recipe
	};
};
