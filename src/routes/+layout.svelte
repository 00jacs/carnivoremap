<script lang="ts">
  import '../app.css';
  import NavigationBar from '$lib/components/navigation-bar.svelte';

  let { children } = $props();
</script>

<NavigationBar />
{@render children()}
