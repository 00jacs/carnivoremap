<script lang="ts">
	// !!! @todo: optimize costs - only fetch once click "Apply filters/Search"; !important
	// !!! @todo: add search queries (better for SEO, sharing links, etc.)

	// import UI components
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import RecipeCard from './_recipe-card.svelte';

	export let data;

	let filteredRecipes: typeof data.recipes = data.recipes;

	let searchQuery: string = '';

	const filterNames = ['beef', 'pork', 'chicken', 'seafood', 'dairy-free'];
	let filters = filterNames.map((name) => ({ text: name, checked: name !== 'dairy-free' }));

	function filterItems(searchQuery: string) {
		filteredRecipes = (data?.recipes || []).filter((recipe) => {
			let searchQuerySatisfied = false;

			if (!searchQuery || searchQuery === '') {
				searchQuerySatisfied = true;
			} else {
				const searchQueryLowercase = searchQuery.toLowerCase();
				searchQuerySatisfied =
					recipe.title.toLowerCase().includes(searchQueryLowercase) ||
					(recipe?.description || '').toLowerCase().includes(searchQueryLowercase);
			}

			let filtersSatisfied = filters.some((filter) => {
				if (filter.checked && ((recipe?.flags as string[]) || []).includes(filter.text)) {
					return true;
				}

				return false;
			});

			return searchQuerySatisfied && filtersSatisfied;
		});
	}

	$: filterItems(searchQuery);
</script>

<div class="mx-auto mt-12 grid w-[90%] max-w-5xl grid-cols-12">
	<div class="hidden md:col-span-4 md:block">
		<div class="mb-12 max-w-48">
			<h2 class="mb-4 text-xl font-semibold">Search</h2>
			<Input type="search" placeholder="Search..." bind:value={searchQuery} />
		</div>

		<div class="mb-12">
			<h2 class="mb-4 text-xl font-semibold">Ingredients</h2>
			<div class="flex flex-col justify-start gap-3">
				{#each filters as filter}
					<div class="flex items-center space-x-2">
						<Checkbox
							id={filter.text}
							checked={filter.checked}
							onCheckedChange={() => {
								filter.checked = !filter.checked;
								filterItems(searchQuery);
							}} />
						<Label
							for={filter.text}
							class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							{filter.text}
						</Label>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="col-span-12 md:col-span-8">
		<h1 class="text-xl font-semibold">Recipes</h1>

		{#if filteredRecipes.length === 0}
			<p class="text mt-3 text-muted-foreground">No recipes found.</p>
			<Button href="/recipes/create" variant="secondary" class="mt-4">Create recipe</Button>
		{:else}
			<div class="mt-8 grid grid-cols-2 gap-4">
				{#each filteredRecipes as recipe}
					<RecipeCard {recipe} />
				{/each}
			</div>
		{/if}
	</div>
</div>
