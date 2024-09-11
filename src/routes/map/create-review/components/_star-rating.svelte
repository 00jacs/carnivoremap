<script lang="ts">
	import Star from 'lucide-svelte/icons/star';

	export let value: number;

	let currentValue = 0;
	let isClicked = false;

	// possible values for star rating
	const values = [1, 2, 3, 4, 5];

	function handleClick(clickedValue: number) {
		if (clickedValue === value && isClicked) {
			isClicked = false;
			value = 0;
		} else {
			isClicked = true;
			value = currentValue;
		}
	}

	function handleMouseOver(val: number) {
		currentValue = val;
	}

	function handleMouseOut() {
		if (!isClicked) {
			currentValue = 0;
		}
	}
</script>

<p class="text-xs text-muted-foreground">
	<span class="font-bold">Star rating:</span>
	{value}
</p>

<div class="pointer-events-auto flex items-center">
	{#each values as _value}
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<button
			class="flex items-center justify-center"
			on:click={() => handleClick(_value)}
			on:mouseover={() => handleMouseOver(_value)}
			on:mouseout={handleMouseOut}>
			<Star
				class="stroke-1.5 pointer-events-auto ml-0.5 mr-0.5 h-6 w-6 text-muted-foreground
          {currentValue >= _value ? 'fill-primary !text-primary' : ''}" />
		</button>
	{/each}
</div>
