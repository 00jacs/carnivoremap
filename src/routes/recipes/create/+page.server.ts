import { fail } from '@sveltejs/kit';
import { CreateRecipeFormDataSchema } from './_validate';

export const actions = {
	// action for creating a recipe
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		// 1. Validate if the user is logged in
		const { session } = await safeGetSession();

		if (!session || !session.user) {
			return fail(500);
		}

		const formData = await request.formData();
		const { data, error } = CreateRecipeFormDataSchema.safeParse({
			title: formData.get('title'),
			description: formData.get('description'),
			flags: formData.getAll('flags[]'),
			prep_time: formData.get('prep_time'),
			cook_time: formData.get('cook_time'),
			price_range: formData.get('price_range'),
			video_link: formData.get('video_link'),
			ingredients: formData.getAll('ingredients[]'),
			content: formData.get('content')
		});

		if (error) {
			console.log('error: ', error.flatten());
			return fail(400);
		}

		console.log('did not fail, data: ', data);

		// @todo: handle a case when the slug already exists (add -1, -2, etc.)
		// @todo: add image upload possibility (S3)
		const { data: supabaseData, error: supabaseError } = await supabase
			.from('recipes')
			.insert(data);

		console.log('supabaseData: ', supabaseData);
		console.log('supabaseError: ', supabaseError);

		if (supabaseError) {
			return fail(500);
		}

		return {
			status: 200,
			success: true
		};
	}
};
