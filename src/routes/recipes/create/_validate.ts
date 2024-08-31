// @todo: add image upload possibility
import z from 'zod';

export const CreateRecipeCacheFormSchema = z.object({
	title: z.string(),
	description: z.string(),
	flags: z.array(z.string()),
	prep_time: z.string(),
	cook_time: z.string(),
	price_range: z.string(),
	video_link: z.string().optional(),
	ingredients: z.array(z.string()),
	content: z.string()
});

export type CreateRecipeCacheFormType = z.infer<typeof CreateRecipeCacheFormSchema>;

export const CreateRecipeFormSchema = z.object({
	title: z
		.string()
		.min(10, 'Title needs to have at least 10 characters')
		.max(255, 'Title can have at most 255 characters'),
	description: z
		.string()
		.min(10, 'Description needs to have at least 10 characters')
		.max(255, 'Description can have at most 255 characters'),
	flags: z.array(z.string()).min(1, 'At least one appropriate flag is required'),
	prep_time: z.string().min(1, 'Preparation time is required'),
	cook_time: z.string().min(1, 'Cook time is required'),
	price_range: z.string().min(1, 'Price range is required'),
	video_link: z.string().optional(),
	ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
	content: z.string().min(100, 'Content of your recipe needs to have at least 100 characters')
});

export type CreateRecipeFormType = z.infer<typeof CreateRecipeFormSchema>;
