import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import logger from '$lib/utils/logger';

import { z } from 'zod';
import { zfd } from 'zod-form-data';

const AuthSchema = z.object({
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	username: z.string().optional(),
	email: z.string().optional(),
	password: z.string().optional()
});

const AuthFormDataSchema = zfd.formData(AuthSchema);

const SignUpSchema = z.object({
	first_name: z
		.string({ message: 'Please type in your correct first name' })
		.min(3, 'First name must be at least 3 characters long')
		.max(50, 'First name must be at most 50 characters long'),
	last_name: z
		.string({ message: 'Please type in your correct last name' })
		.min(3, 'Last name must be at least 3 characters long')
		.max(50, 'Last name must be at most 50 characters long'),
	username: z
		.string({ message: 'Please type in correct username' })
		.min(4, 'Username must be at least 4 characters long')
		.max(15, 'Username must be at most 15 characters long'),
	email: z.string().email(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.max(32, 'Password must be at most 32 characters long')
		.superRefine((password, ctx) => {
			if (
				!/[A-Z]/.test(password) ||
				!/[a-z]/.test(password) ||
				!/[0-9]/.test(password) ||
				!/[!@#$%^&*]/.test(password)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Password must contain at least one uppercase character, lowercase character, number, and special character.',
					path: ['password']
				});
			}

			return true;
		})
});

type SignUpSchemaType = z.infer<typeof SignUpSchema>;

const SignInSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

type SignInSchemaType = z.infer<typeof SignInSchema>;
const SignInFormDataSchema = zfd.formData(SignInSchema);

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		logger.info('[auth/signup] Received new sign-up request.');

		const { data: formData, error: authFormError } = AuthFormDataSchema.safeParse(
			await request.formData()
		);

		if (authFormError) {
			// @telegram
			return redirect(300, '/auth/error');
		}

		const { data, error } = SignUpSchema.safeParse(formData);

		if (error) {
			logger.info('[auth/signup] Invalid form data received.', error);

			const fieldErrors = error.flatten().fieldErrors as {
				[key in keyof SignUpSchemaType]: string[];
			};

			return fail(400, {
				message: 'Invalid form data',
				values: {
					...formData,
					password: ''
				},
				errors: {
					first_name: fieldErrors?.first_name?.[0] || false,
					last_name: fieldErrors?.last_name?.[0] || false,
					username: fieldErrors?.username?.[0] || false,
					email: fieldErrors?.email?.[0] || false,
					password: fieldErrors?.password?.[0] || false
				}
			});
		} else {
			logger.info('[auth/signup] Form data has been parsed succesfully - is valid.');
		}

		const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				data: {
					email: data.email,
					first_name: data.first_name,
					last_name: data.last_name,
					username: data.username
				}
			}
		});

		// @todo: implement username taken error
		if (signUpError) {
			logger.error(
				'[auth/signup] Error occurred while signing up user with supabase: ',
				signUpError
			);

			return fail(400, {
				message: 'Invalid credentials. Please try again (or contact support).',
				errors: {
					first_name: false,
					last_name: false,
					username: false,
					email: false,
					password: false
				},
				values: {
					...formData,
					password: ''
				}
			});
		}

		logger.success(
			`[auth/signup] User signed up successfully (id: ${signUpData?.user?.id}, email: ${data.email})`
		);

		return redirect(300, '/auth/email-sent/' + data.email);
	},

	signin: async ({ request, locals: { supabase } }) => {
		logger.info('[auth/signin] Received new sign-in request.');

		const { data: formData, error: authFormError } = AuthFormDataSchema.safeParse(
			await request.formData()
		);

		if (authFormError) {
			// @telegram
			return redirect(300, '/auth/error');
		}

		const { data, error } = SignInFormDataSchema.safeParse(formData);

		if (error) {
			logger.info('[auth/signin] Invalid form data received.', error);

			const fieldErrors = error.flatten().fieldErrors as {
				[key in keyof SignInSchemaType]: string[];
			};

			return fail(400, {
				message: 'Invalid form data',
				values: {
					...formData,
					password: ''
				},
				errors: {
					first_name: false,
					last_name: false,
					username: false,
					email: fieldErrors?.email?.[0] || false,
					password: fieldErrors?.password?.[0] || false
				}
			});
		} else {
			logger.info('[auth/signin] Form data has been parsed succesfully - is valid.');
		}

		const { error: signInError } = await supabase.auth.signInWithPassword(data);

		if (signInError) {
			logger.error(
				'[auth/signin] Error occurred while signing in user with supabase: ',
				signInError
			);

			return fail(400, {
				message: 'Invalid credentials',
				values: {
					first_name: '',
					last_name: '',
					username: '',
					email: formData.email,
					password: ''
				},
				errors: {
					first_name: false,
					last_name: false,
					username: false,
					email: 'Invalid email or password',
					password: 'Invalid email or password'
				}
			});
		} else {
			logger.success(`User signed in successfully (email: ${data.email})`);
			return redirect(303, '/private');
		}
	}
};
