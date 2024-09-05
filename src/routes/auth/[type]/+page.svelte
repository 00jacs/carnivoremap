<script lang="ts">
	/* TODO:
	 * - implement OAuth login (priority: 6)
	 * - implement form loading state (priority: 8) https://stackoverflow.com/questions/76580769/implementing-a-loading-spinner-in-sveltekit-that-is-triggered-during-an-action
	 * - improve design on mobile (mobile-first) (priority: 7)
	 */

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import InputField from './_input_field.svelte';

	export let form;
</script>

<Card.Root class="mx-auto my-20 max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">
			{$page.params.type === 'login' ? 'Login' : 'Sign Up'}
		</Card.Title>
		<Card.Description>
			{$page.params.type === 'login'
				? 'Fill in your username and password to log in.'
				: 'Fill in the data below to create an account.'}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			method="POST"
			action={$page.params.type === 'login' ? '?/signin' : '?/signup'}
			class="grid gap-8"
			use:enhance>
			{#if $page.params.type === 'register'}
				<div class="grid grid-cols-2 gap-4">
					<InputField
						name="first_name"
						label="First name"
						placeholder="Max"
						value={form?.values?.first_name || ''}
						error={form?.errors?.first_name} />

					<InputField
						name="last_name"
						label="Last name"
						placeholder="Robinson"
						value={form?.values?.last_name || ''}
						error={form?.errors?.last_name} />
				</div>

				<InputField
					name="username"
					label="Username"
					placeholder="maxrobinson"
					value={form?.values?.username || ''}
					error={form?.errors?.username} />
			{/if}

			<InputField
				type="email"
				name="email"
				label="Email"
				placeholder="m@example.com"
				value={form?.values?.email || ''}
				error={form?.errors?.email} />

			<InputField type="password" name="password" label="Password" error={form?.errors?.password} />

			<Button type="submit" class="w-full">
				{$page.params.type === 'login' ? 'Sign in to your account' : 'Create an account'}
			</Button>

			<!--
        @todo: Implement OAuth login
        <Button variant="outline" class="w-full">Sign up with Google</Button>
			  <Button variant="outline" class="w-full">Sign up with GitHub</Button>
      -->
		</form>
		<div class="mt-4 text-center text-sm">
			{#if $page.params.type === 'login'}
				Don't have an account?
				<a href="/auth/register" class="underline">Sign up.</a>
			{:else}
				Already have an account?
				<a href="/auth/login" class="underline">Sign in.</a>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
