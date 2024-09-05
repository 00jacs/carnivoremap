<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	export let form;

	$: if (form?.success) {
		toast.success('Email sent successfully');
	}
</script>

<div class="mx-auto mt-20 max-w-xl px-8 py-12 text-center">
	<h1 class="mb-2 text-2xl font-bold">We have sent you an email</h1>

	<p class="text-muted-foreground">
		Thanks for registering to CarnivoreMap! Please check your inbox and click the link to verify
		your email address.
	</p>

	{#if typeof form?.success == 'undefined'}
		<form
			method="POST"
			action="?/resend"
			class="mt-12 flex flex-col items-center justify-center gap-2 text-center text-muted-foreground"
			use:enhance>
			<span class="block">Didn't receive the email?</span>
			<Button type="submit" variant="outline">Resend verification email</Button>
		</form>
	{:else if !form.success}
		<p class="mt-12 text-muted-foreground">
			There's been an error sending the email. Please try again later or contact support.
		</p>
	{:else}
		<p class="mt-12 text-muted-foreground">
			We have resent the email. If you don't receive the email within a few minutes, please check
			your spam folder.
		</p>
	{/if}
</div>
