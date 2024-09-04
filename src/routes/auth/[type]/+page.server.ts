// useful article: https://nocodegarden.io/blog/creating-user-profiles-on-sign-up-in-supabase

import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import logger from '$lib/utils/logger';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		// !!! @todo: add form validation with zod/zfd
		const first_name = formData.get('first_name') as string;
		const last_name = formData.get('last_name') as string;
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { data: signUpData, error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		}

		const { data: profileData, error: profileError } = await supabase.from('profiles').insert([
			{
				id: signUpData?.user?.id || '',
				first_name,
				last_name,
				username,
				email
			}
		]);

		if (profileError) {
			console.error(profileError);

			await supabase.auth.admin.deleteUser(signUpData?.user?.id || '');

			redirect(303, '/auth/error');
		}

		console.log(profileData);
		logger.success(`User signed up successfully (id: ${signUpData?.user?.id}, email: ${email})`);
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/private');
		}
	}
};
