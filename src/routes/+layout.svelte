<script lang="ts">
  import '../app.css';
  import NavigationBar from '$lib/components/navigation-bar.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>CarnivoreMap</title>
</svelte:head>

<NavigationBar />

{@render children()}
