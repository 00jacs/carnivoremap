<script lang="ts">
  import { form, toggleFlag } from '../form';

  const generalFields = [
    {
      key: 'title',
      label: 'Title',
      hint: 'How is this place called?'
    },
    {
      key: 'description',
      label: 'Description',
      hint: 'Please describe this place in 1-2 sentences.'
    }
  ] as const;

  const flags = [
    {
      key: 'butcher',
      label: 'Is a butcher shop?'
    },
    {
      key: 'rawDairy',
      label: 'Sells raw dairy?'
    },
    {
      key: 'fish',
      label: 'Sells fish?'
    },
    {
      key: 'honey',
      label: 'Sells raw honey?'
    }
  ] as const;
</script>

<section id="general-form" class="flex flex-col gap-4">
  <div class="flex flex-col gap-6">
    {#each generalFields as { key, label, hint }}
      <label for={key} class="flex w-full flex-col gap-2">
        <span class="block font-semibold">{label}</span>
        <input
          class="input input-bordered w-full"
          required
          bind:value={$form.general[key]} />
        {#if hint}
          <span class="ml-1 mt-1 block text-sm opacity-60">
            {hint}
          </span>
        {/if}
      </label>
    {/each}
  </div>

  <div class="mt-8 flex flex-col gap-2">
    {#each flags as { key, label }}
      <label
        for={key}
        class="label form-control flex cursor-pointer flex-row justify-start gap-2">
        <span class="label-text">{label}</span>
        <input
          type="checkbox"
          class="checkbox"
          checked={$form.general.flags.includes(key)}
          onchange={() => toggleFlag(key)} />
      </label>
    {/each}
  </div>
</section>
