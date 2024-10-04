<script lang="ts">
  import { form } from '../form';
  import { MapPin, MapPinCheck } from 'lucide-svelte';

  const location = [
    {
      key: 'streetAddress',
      label: 'Street address',
      placeholder: 'Washington 156',
      value: '',
      width: 6
    },
    {
      key: 'streetNumber',
      label: 'Street number',
      placeholder: '148',
      width: 3
    },
    {
      key: 'country',
      label: 'Country',
      placeholder: 'Poland',
      width: 3
    },
    {
      key: 'city',
      label: 'City',
      placeholder: 'Torun',
      value: '',
      width: 6
    },
    {
      key: 'postalCode',
      label: 'Postal code',
      placeholder: '87-100',
      value: '',
      width: 6
    }
  ] as const;

  let isLocationConfirmed = $state(false);
</script>

<section class="grid grid-cols-6 gap-4 md:grid-cols-12">
  {#each location as { key, width, label }}
    <label for={key} class="col-span-{width} flex flex-col gap-2">
      <span class="block font-semibold">{label}</span>
      <input
        class="input input-bordered"
        bind:value={$form.location[key]}
        oninput={() => (isLocationConfirmed = false)} />
    </label>
  {/each}

  <button
    type="button"
    class="btn col-span-6 mt-4 md:!col-span-12 {isLocationConfirmed
      ? 'btn-disabled btn-ghost !text-primary'
      : 'btn-primary'} w-full"
    onclick={() => (isLocationConfirmed = true)}>
    {#if isLocationConfirmed}
      <MapPinCheck class="h-4 w-4" />
      Location confirmed.
    {:else}
      <MapPin class="h-4 w-4" />
      Confirm location
    {/if}
  </button>
</section>

<style>
  .col-span-3 {
    grid-column: span 3 / span 3;
  }

  .col-span-4 {
    grid-column: span 4 / span 4;
  }

  .col-span-6 {
    grid-column: span 6 / span 6;
  }

  .col-span-8 {
    grid-column: span 8 / span 8;
  }

  .col-span-12 {
    grid-column: span 12 / span 12;
  }
</style>
