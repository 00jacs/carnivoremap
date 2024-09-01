<script lang="ts">
	import { page } from '$app/stores';

	// import UI components
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import RecipeCard from './_recipe-card.svelte';

	export let data;

	const items = [
		{
			id: 'beef',
			text: 'Beef',
			checked: true
		},
		{
			id: 'pork',
			text: 'Pork',
			checked: true
		},
		{
			id: 'chicken',
			text: 'Chicken',
			checked: true
		},
		{
			id: 'seafood',
			text: 'Seafood',
			checked: true
		},
		{
			id: 'dairy-free',
			text: 'Dairy-free',
			checked: false
		}
	];

	const categories = [
		'All recipes',
		'Steaks',
		'Snacks',
		'Desserts',
		'Pancakes',
		'Mexican',
		'American',
		'Grill'
	];

	$: chosenCategory = $page.url?.searchParams?.get('category') || 'All recipes';
</script>

<div class="mx-auto mt-12 grid w-[90%] max-w-5xl grid-cols-12">
	<div class="hidden md:col-span-4 md:block">
		<div class="mb-12 max-w-48">
			<h2 class="mb-4 text-xl font-semibold">Search</h2>
			<Input type="search" placeholder="Search..." class="" />
		</div>

		<div class="mb-12">
			<h2 class="mb-4 text-xl font-semibold">Ingredients</h2>
			<div class="flex flex-col justify-start gap-3">
				{#each items as item}
					<div class="flex items-center space-x-2">
						<Checkbox id={item.id} bind:checked={item.checked} />
						<Label
							for={item.id}
							class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							{item.text}
						</Label>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-xl font-semibold">Categories</h2>
			<div class="flex flex-col justify-start gap-2">
				{#each categories as category}
					<a
						href="?category={category}"
						class={category === chosenCategory ? 'font-medium text-primary underline' : ''}>
						{category}
					</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="col-span-12 md:col-span-8">
		<h1 class="text-xl font-semibold">Recipes</h1>

		{#if data.recipes?.length === 0}
			<p class="text mt-3 text-muted-foreground">No recipes found.</p>
			<Button href="/recipes/create" variant="secondary" class="mt-4">Create recipe</Button>
		{:else}
			<div class="mt-8 grid grid-cols-2 gap-4">
				{#each data.recipes as recipe}
					<RecipeCard {recipe} />
				{/each}
			</div>
		{/if}
	</div>
</div>
