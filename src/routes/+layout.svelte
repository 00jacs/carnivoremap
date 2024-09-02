<script lang="ts">
	import '../app.pcss';

	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { user } from '$lib/auth';

	// theme-related
	import { ModeWatcher } from 'mode-watcher';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';

	// UI components
	import { Toaster } from '$lib/components/ui/sonner';
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
<Toaster position="top-center" />

<header>
	<div class="mx-auto flex max-w-7xl justify-between px-8 pt-8">
		<a href="/" class="mb-0.5 flex items-center justify-center">
			<span
				id="logo"
				class="logo font-semibold duration-200 hover:text-primary"
				style="font-size: 1.1rem;">
				🥩 &nbsp;&nbsp;Carnivore Map
			</span>
		</a>

		<div class="flex gap-2">
			<Button href="/recipes" variant="outline">Recipes</Button>
			<Button href="/recipes/create" variant="outline">Create recipe</Button>
			<Button href="/map" variant="outline">Map</Button>

			{#if session && session.user}
				<Button on:click={logout} variant="outline">Logout</Button>
			{:else}
				<div class="flex gap-2">
					<!-- @todo: add avatar -->
					<Button href="/auth/login" variant="outline">Login</Button>
				</div>
			{/if}

			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</header>

<main>
	<slot />
</main>
