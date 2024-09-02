<script lang="ts">
	import type { Database } from '$lib/supabase';

	// import necessary icons
	import UserPen from 'lucide-svelte/icons/user-pen';
	import Clock from 'lucide-svelte/icons/clock';
	import CookingPot from 'lucide-svelte/icons/cooking-pot';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import Star from 'lucide-svelte/icons/star';

	// import UI components
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';

	export let recipe: Database['public']['Tables']['recipes']['Row'];

	let isStarred = false;
	function starRecipe() {
		console.log('Starred recipe:', recipe);
		isStarred = !isStarred;

		if (isStarred) {
			toast.success('Added recipe to Favorites');
		} else {
			toast.info('Removed recipe from Favorites');
		}
	}
</script>

<Card.Root>
	<a href="/recipes/{recipe.slug}">
		<Card.Header>
			<Card.Title>{recipe.title}</Card.Title>
			<Card.Description>{recipe.description}</Card.Description>
		</Card.Header>
	</a>
	<Card.Content>
		<div class="flex flex-col gap-1">
			<span class="flex items-center gap-2 text-sm text-muted-foreground">
				<Clock class="h-4 w-4" />
				{recipe.prep_time} minutes prep
			</span>
			<span class="flex items-center gap-2 text-sm text-muted-foreground">
				<CookingPot class="h-4 w-4" />
				{recipe.cook_time} minutes till ready
			</span>
			<span class="flex items-center gap-2 text-sm text-muted-foreground">
				<DollarSign class="h-4 w-4" />
				{recipe.price_range}
			</span>
		</div>
	</Card.Content>
	<Card.Footer class="relative">
		<p class="flex items-center gap-1 text-sm text-muted-foreground">
			<UserPen class="h-4 w-4" />
			<!-- todo: fetch username -->
			{recipe.user_id.slice(0, 8)}...
		</p>

		<button class="absolute bottom-5 right-5" on:click={() => starRecipe()}>
			{#if isStarred}
				<Star class="h-5 w-5 fill-yellow-500 text-yellow-400" />
			{:else}
				<Star class="h-5 w-5 text-muted-foreground" />
			{/if}
		</button>
	</Card.Footer>
</Card.Root>
