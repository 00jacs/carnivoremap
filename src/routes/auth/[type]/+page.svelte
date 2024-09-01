<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<Card.Root class="mx-auto max-w-sm">
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
		<form method="POST" action="?/login" class="grid gap-4">
			{#if $page.params.type === 'register'}
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="first-name">First name</Label>
						<Input id="first-name" name="first-name" placeholder="Max" required />
					</div>
					<div class="grid gap-2">
						<Label for="last-name">Last name</Label>
						<Input id="last-name" name="last-name" placeholder="Robinson" required />
					</div>
				</div>
			{/if}

			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" name="email" placeholder="m@example.com" required />
			</div>

			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" name="password" />
			</div>

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
