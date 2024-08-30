<script lang="ts">
	// import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	const frameworks = [
		{
			value: 'austin/tx/us',
			label: 'Austin, Texas, USA'
		},
		{
			value: 'miami/fl/us',
			label: 'Miami, Florida, USA'
		},
		{
			value: 'nyc/ny/us',
			label: 'New York, New York, USA'
		},
		{
			value: 'la/ca/us',
			label: 'Los Angeles, California, USA'
		},
		{
			value: 'london/uk',
			label: 'London, UK'
		}
	];

	let open = false;
	let value = '';

	$: selectedValue = frameworks.find((f) => f.value === value)?.label ?? 'Select a region...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	interface FilterItem {
		id: string;
		text: string;
		checked: boolean;
	}

	const items: FilterItem[] = [
		{
			id: 'butchers',
			text: 'Butchers',
			checked: false
		},
		{
			id: 'raw-dairy',
			text: 'Raw dairy',
			checked: false
		},
		{
			id: 'restaurants',
			text: 'Restaurants',
			checked: false
		}
	];
</script>

<!--
<div class="max-w-xl mx-auto">
	<ToggleGroup.Root variant="outline" type="multiple">
		{#each items as item}
			<ToggleGroup.Item value={item.text} aria-label={item.text}>
				{item.text}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</div>
-->
<div class="mx-auto mt-12 max-w-xl">
	<h2 class="mb-4 text-2xl font-semibold">Choose places</h2>
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

<div class="mx-auto mt-12 max-w-xl">
	<h2 class="mb-4 text-2xl font-semibold">Choose region</h2>
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-[200px] justify-between">
				{selectedValue}
				<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input placeholder="Search places..." class="h-9" />
				<Command.Empty>No place found.</Command.Empty>
				<Command.Group>
					{#each frameworks as framework}
						<Command.Item
							value={framework.value}
							onSelect={(currentValue) => {
								value = currentValue;
								closeAndFocusTrigger(ids.trigger);
							}}>
							<Check class={cn('mr-2 h-4 w-4', value !== framework.value && 'text-transparent')} />
							{framework.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>

<div></div>
