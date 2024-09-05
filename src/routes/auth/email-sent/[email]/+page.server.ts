import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import logger from '$lib/utils/logger';

export const actions: Actions = {
	resend: async ({ params, locals: { supabase } }) => {
		const { email } = params;
		logger.info('[auth/email-sent] Resending email verification: ', email);

		const { error } = await supabase.auth.resend({
			type: 'signup',
			email
		});

		if (error) {
			logger.error('[auth/email-sent] Error while resending email verification.', error);

			return fail(400, {
				message: 'Error while resending email verification',
				errors: {
					email: 'Invalid email address. Please try again or contact support.'
				}
			});
		} else {
			logger.success(`[auth/email-sent] Email verification resent to ${email}.`);

			return {
				status: 200,
				success: true,
				message: `Email verification resent to ${email}.`
			};
		}
	}
};
