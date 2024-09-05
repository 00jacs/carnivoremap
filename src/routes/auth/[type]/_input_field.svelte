<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	export let type: 'text' | 'email' | 'password' = 'text';
	export let name: string;
	export let label: string;
	export let placeholder: string = '';
	export let value: string = '';
	export let error: string | undefined | boolean = '';
	export let required: boolean = true;
</script>

<div class="grid gap-2">
	<Label for={name}>{label}</Label>
	<Input
		{type}
		id={name}
		{name}
		{placeholder}
		{required}
		bind:value
		class={error ? 'border-primary' : ''} />

	{#if error}
		<p class="ml-0.5 text-sm font-medium text-primary">{error}</p>
	{/if}
</div>
