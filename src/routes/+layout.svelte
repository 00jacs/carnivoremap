<script lang="ts">
	import '../app.pcss';

	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { user } from '$lib/auth';

	import { ModeWatcher } from 'mode-watcher';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				$user = null;
				invalidate('supabase:auth');
			} else {
				$user = newSession?.user;
			}
		});

		return () => data.subscription.unsubscribe();
	});

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			$user = null;
			goto('/auth/login');
		}
	};
</script>

<ModeWatcher />

<header>
	<div class="mx-auto flex max-w-4xl justify-between px-8 pt-8">
		<div>
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>

		<div>
			{#if session && session.user}
				<Button on:click={logout} variant="outline">Logout</Button>
			{:else}
				<div class="flex gap-2">
					<!-- @todo: add avatar -->
					<Button href="/auth/login" variant="outline">Login</Button>
				</div>
			{/if}
		</div>
	</div>
</header>

<main>
	<slot />
</main>
