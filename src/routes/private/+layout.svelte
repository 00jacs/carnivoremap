<script>
	import { goto } from '$app/navigation';

	export let data;
	$: ({ supabase } = data);

	$: logout = async () => {
		console.log('Logging out...');

		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			goto('/auth/login');
		}
	};
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
	<button on:click={logout}>Logout</button>
</header>
<main>
	<slot />
</main>
