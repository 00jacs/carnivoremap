<script lang="ts">
  import '../app.css';
  import NavigationBar from '$lib/components/navigation-bar.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>CarnivoreMap</title>
  <meta property="og:title" content="Carnivore Map" />
  <meta
    property="og:description"
    content="Explore carnivore spots (farms, raw dairy, restaurants) from all around the world!" />
  <meta property="og:url" content="https://carnivoremap.com/" />
  <meta property="og:type" content="website" />

  <meta name="twitter:title" content="Carnivore Map" />
  <meta
    name="twitter:description"
    content="Explore carnivore spots (farms, raw dairy, restaurants) from all around the world!" />
  <!--
  <meta
    name="twitter:image"
    content="https://carnivoremap.com/twitter-image.jpg" />
  -->
</svelte:head>

<NavigationBar />

{@render children()}
