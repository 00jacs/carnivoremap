<script lang="ts">
  const { data } = $props();
  const { place } = data;
</script>

<div class="mx-auto max-w-2xl px-8 py-12">
  <span class="mb-4 block text-sm font-bold tracking-wider">
    REVIEWING PLACE
  </span>
  <h1 class="mb-2 text-xl font-bold md:text-3xl">{place.title}</h1>
  <p class="mb-2">{place.description}</p>

  <ul class="flex gap-1 text-sm opacity-60">
    <span>{place.streetAddress} {place.streetNumber}</span>
    <div class="divider divider-horizontal"></div>
    <span>{place.postalCode} {place.city}</span>
    <div class="divider divider-horizontal"></div>
    <span>{place.country}</span>
  </ul>
</div>
