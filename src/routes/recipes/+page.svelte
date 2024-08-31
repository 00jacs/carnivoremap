<script lang="ts">
	import { page } from '$app/stores';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

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

<div class="mx-auto mt-12 w-[90%] max-w-5xl">
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
