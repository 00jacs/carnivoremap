<script lang="ts">
	import '../app.pcss';

	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { user } from '$lib/auth';

	// theme-related
	import { ModeWatcher } from 'mode-watcher';

	// UI components
	import { Toaster } from '$lib/components/ui/sonner';

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
</script>

<ModeWatcher />
<Toaster position="top-center" />

<main>
	<slot />
</main>
