<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import logger from '$lib/utils/logger.js';
	import { goto } from '$app/navigation';

	// Import necessary icons
	import Clock from 'lucide-svelte/icons/clock';
	import CookingPot from 'lucide-svelte/icons/cooking-pot';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';

	export let data;
	let ingredients: Array<{ name: string; quantity: string }> = [];

	let splitContent = data?.recipe?.content?.split('\n') ?? [];

	onMount(() => {
		const { data: _ingredients, error } = z
			.array(z.string())
			.safeParse(data?.recipe?.ingredients ?? []);

		if (!_ingredients || error) {
			logger.error('Failed to retrieve post.', error);
			toast.error('Failed to retrieve post.');
			goto('/recipes/list');
			return;
		}

		ingredients = _ingredients
			.map((ingredient: string) => {
				const [name, quantity] = ingredient.split('###');

				return {
					name,
					quantity
				};
			})
			.filter((ingredient) => ingredient.name && ingredient.quantity);
	});
</script>

{#if data.recipe}
	<article class="mx-auto mt-12 max-w-2xl px-8 py-16">
		<header class="mb-12">
			<h1 class="mb-2 text-3xl font-semibold">
				{data.recipe.title}
			</h1>

			<p class="text-muted-foreground">
				{data.recipe.description}
			</p>

			<div class="mt-4 flex flex-col gap-1">
				<span class="flex items-center gap-2 text-muted-foreground">
					<Clock class="h-4 w-4" />
					{data.recipe.prep_time} minutes prep
				</span>
				<span class="flex items-center gap-2 text-muted-foreground">
					<CookingPot class="h-4 w-4" />
					{data.recipe.cook_time} minutes till ready
				</span>
				<span class="flex items-center gap-2 text-muted-foreground">
					<DollarSign class="h-4 w-4" />
					{data.recipe.price_range}
				</span>
			</div>
		</header>

		<main>
			<section class="mb-12">
				<h2 class="mb-2 text-2xl font-semibold">Necessary ingredients</h2>
				<ul class="flex flex-col gap-4">
					{#each ingredients as ingredient}
						<li>
							<p>{ingredient.name}</p>
							<span class="text-muted-foreground">quantity: {ingredient.quantity}</span>
						</li>
					{/each}
				</ul>
			</section>

			<section>
				<h2 class="mb-2 text-2xl font-semibold">How to prepare?</h2>
				{#each splitContent as paragraph}
					<p class="mb-3">{paragraph}</p>
				{/each}
			</section>
		</main>
	</article>
{:else}
	<p>Loading...</p>
{/if}
