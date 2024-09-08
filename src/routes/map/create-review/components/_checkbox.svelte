<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	export let label: string;
	export let checked: boolean;
</script>

<div class="flex items-center gap-2">
	<Checkbox bind:checked />
	<Label>{label}</Label>
</div>
