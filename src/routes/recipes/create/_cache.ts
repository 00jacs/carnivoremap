import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { CreateRecipeCacheFormSchema, type CreateRecipeCacheFormType } from './_validate';

// sync form with localStorage (caching = improve UX, less frustration)
const CACHE_KEY = 'create-recipe-form';

const emptyForm: CreateRecipeCacheFormType = {
	title: '',
	description: '',
	flags: [],
	prep_time: '',
	cook_time: '',
	price_range: '',
	video_link: '',
	ingredients: [],
	content: ''
};

function getCachedForm(): CreateRecipeCacheFormType {
	if (!browser || !localStorage) {
		return emptyForm;
	}

	const cached = localStorage.getItem(CACHE_KEY);
	if (!cached) {
		return emptyForm;
	}

	try {
		const json = JSON.parse(cached);

		// validate the cached form
		const validated = CreateRecipeCacheFormSchema.parse(json);

		if (validated) return validated;
		return emptyForm;
	} catch (e) {
		console.error('Error parsing cached form', e);
		return emptyForm;
	}
}

function updateCache(newForm: CreateRecipeCacheFormType) {
	if (!browser || typeof localStorage === 'undefined') return;

	try {
		const validated = CreateRecipeCacheFormSchema.parse(newForm);
		localStorage.setItem(CACHE_KEY, JSON.stringify(validated));
	} catch (e) {
		console.error('Error updating cache', e);
	}
}

export const form = writable<CreateRecipeCacheFormType>(getCachedForm());

form.subscribe(updateCache);

export default form;
