<script lang="ts">
  import { fade } from 'svelte/transition';
  import { ArrowUp, X } from 'lucide-svelte';
  import { type PlaceFlag } from '../form/form';

  const { place, close } = $props();

  const icons: Record<PlaceFlag, string> = {
    butcher: '🥩',
    fish: '🐟',
    dairy: '🥛',
    honey: '🍯',
    restaurant: '🍽️'
  };

  const info = [
    {
      label: 'Website',
      key: 'websiteUrl',
      isLink: true
    },
    {
      label: 'Social Media',
      key: 'socialMediaUrl',
      isLink: true
    },
    {
      label: 'Email',
      key: 'email'
    },
    {
      label: 'Phone',
      key: 'phone'
    }
  ] as const;
</script>

<div
  id="selected-place"
  class="col-span-12 mt-12 px-4 pb-24 pt-12 md:col-span-6 md:mt-0 md:pb-0 md:pt-0 xl:col-span-4"
  transition:fade>
  <a
    href="#map-container"
    class="mb-4 flex items-center justify-start gap-2 font-semibold md:hidden">
    <ArrowUp class="h-4 w-4" />Go back to map
  </a>

  <div class="relative rounded-lg border px-4 py-3">
    <button class="absolute right-4 top-4" onclick={close}>
      <X class="h-4 w-4" />
    </button>

    <h2 class="font-bold md:text-2xl">{place.title}</h2>
    <div
      class="mb-4 flex flex-wrap items-center justify-start text-sm opacity-60">
      {place.streetAddress}
      {place.streetNumber}
      <div class="divider divider-horizontal mx-0"></div>
      {place.postalCode},
      {place.city}
      <div class="divider divider-horizontal mx-0"></div>
      {place.country}
    </div>

    <p class="mb-4 mt-1 text-sm opacity-60">{place.description}</p>

    <ul class="flex flex-col gap-2 text-sm">
      {#each info as { label, key, isLink }}
        <li>
          <span class="font-bold">{label}:</span>
          {#if place[key] && isLink}
            <a href={place[key]} class="link" target="_blank">{place[key]}</a>
          {:else}
            <span class={place[key] ? 'opacity-80' : 'opacity-60'}>
              {place[key] ?? 'not provided'}
            </span>
          {/if}
        </li>
      {/each}
    </ul>

    <h3 class="mt-6 text-lg font-semibold">What is this place?</h3>
    <ul class="flex flex-col gap-2 text-sm">
      {#each place.flags as flag}
        <li>{icons[flag]} {flag}</li>
      {/each}
    </ul>

    <p class="mt-6 text-sm opacity-60">
      If you'd like to report this place or edit it, please write as un email
      with an explanation <a href="/contact" class="link">here</a>
      .
    </p>
  </div>
</div>
