<script lang="ts">
	import Reload from 'svelte-radix/Reload.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="mx-auto mt-12 max-w-xl text-center">
	<h1 class="undelrine text-3xl font-bold">Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a>
		to read the documentation
	</p>
</div>

<div class="align-center mx-auto mt-8 flex max-w-xl justify-center gap-4">
	<Button>Click me</Button>
	<Button variant="outline">Button</Button>
	<Button disabled>
		<Reload class="mr-2 h-4 w-4 animate-spin" />
		Please wait
	</Button>
</div>
