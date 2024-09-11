<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import Checkbox from './components/_checkbox.svelte';
	import StarRating from './components/_star-rating.svelte';

	const PLACE_FLAGS = [
		'isButcherShop',
		'sellsRawDairy',
		'sellsSeafood',
		'sellsReadyMeals',
		'sellsRawHoney'
	] as const;

	type PlaceFlags = (typeof PLACE_FLAGS)[number];

	let flags: Record<PlaceFlags, { label: string; checked: boolean }> = {
		isButcherShop: {
			label: 'is a butcher shop?',
			checked: false
		},
		sellsRawDairy: {
			label: 'sells raw dairy?',
			checked: false
		},
		sellsSeafood: {
			label: 'sells seafood?',
			checked: false
		},
		sellsReadyMeals: {
			label: 'sells ready meals? (restaurant/bbq/cafe)',
			checked: false
		},
		sellsRawHoney: {
			label: 'sells raw honey?',
			checked: false
		}
	};

	let placeOverallRating = 0;
</script>

<main class="mx-auto my-12 max-w-2xl px-8 py-12">
	<h1 class="mb-4 text-xl font-semibold md:text-2xl">Add your review</h1>

	<form action="">
		<section id="01-details" class="flex flex-col gap-2">
			<h2 class="font-semibold">1&#41; What is this place? What do they sell?</h2>
			<p class="mb-4 text-sm text-muted-foreground">Please select all that apply.</p>

			{#each PLACE_FLAGS as flag}
				<Checkbox label={flags[flag].label} bind:checked={flags[flag].checked} />
			{/each}
		</section>

		<Separator class="my-8" />

		<section id="02-rating" class="flex flex-col gap-2">
			<h2 class="font-semibold">2&#41; How do you rate this place?</h2>
			<p class="mb-4 text-sm text-muted-foreground">Please choose an appropriate star rating.</p>

			<StarRating bind:value={placeOverallRating} />
		</section>

		<Separator class="my-8" />

		<section id="03-description" class="flex flex-col gap-2">
			<h2 class="font-semibold">3&#41; Please describe this place in a few sentences.</h2>
			<p class="mb-4 text-sm text-muted-foreground">
				Do you like this place? Why and why not? What can you get there? Why is it good for
				carnivores?
			</p>

			<Textarea placeholder="Please describe this place in a few sentences." class="h-32" />
		</section>
	</form>
</main>
