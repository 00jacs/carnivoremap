import { fail } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
import { CreateRecipeFormDataSchema } from './_validate';

import { db, recipes } from '$lib/db';

export const actions = {
	default: async ({ request, locals: { safeGetSession } }) => {
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

		try {
			await db
				.insert(recipes)
				.values({
					title: data.title,
					slug: data.slug,
					description: data.description,
					content: data.content,
					prepTime: data.prep_time,
					cookTime: data.cook_time,
					priceRange: data.price_range,
					videoLink: data.video_link,
					ingredients: [{ name: 'test', quantity: 'test' }],
					flags: data.flags,
					authorID: session.user.id
				})
				.execute();
		} catch (e) {
			logger.error('[recipes/create] Error occurred while inserting a new recipe:', e);
		}

		return {
			status: 200,
			success: true
		};
	}
};
