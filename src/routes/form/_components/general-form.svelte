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
      key: 'dairy',
      label: 'Sells raw dairy?'
    },
    {
      key: 'fish',
      label: 'Sells fish?'
    },
    {
      key: 'honey',
      label: 'Sells raw honey?'
    },
    {
      key: 'restaurant',
      label: 'Is it a carnivore/keto-friendly restaurant?'
    }
  ] as const;

  const moreGeneralFields = [
    {
      key: 'websiteUrl',
      label: 'Website URL',
      hint: 'If they have a website, please share the link here.'
    },
    {
      key: 'email',
      label: 'Their email',
      hint: 'If their email is public, please share it.'
    },
    {
      key: 'phone',
      label: 'Their phone',
      hint: 'If their phone is public, please share it.'
    },
    {
      key: 'socialMediaUrl',
      label: 'Social media URL',
      hint: 'Facebook/Instagram/TikTok URL (if they have one)'
    }
  ] as const;
</script>

<section id="general-form">
  <div class="mb-4 flex flex-col gap-8">
    {#each generalFields as { key, label, hint }}
      <label for={key} class="flex w-full flex-col gap-2">
        <span class="block font-semibold">{label}</span>
        <input
          class="input input-bordered w-full"
          required
          bind:value={$form.general[key]} />
        {#if hint}
          <span class="ml-1 mt-0.5 block text-sm opacity-60">
            {hint}
          </span>
        {/if}
      </label>
    {/each}
  </div>

  <label class="mb-1 mt-8 block font-semibold">Choose appropriate flags</label>
  <span class="mb-4 block text-sm opacity-60">
    Please choose flags which fit the place that you're adding.
  </span>

  <div class="mb-6 flex flex-col gap-2">
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

  <div class="mb-4 flex flex-col gap-8">
    {#each moreGeneralFields as { key, label, hint }}
      <label for={key} class="flex w-full flex-col gap-2">
        <span class="block font-semibold">{label}</span>
        <input
          class="input input-bordered w-full"
          bind:value={$form.general[key]} />
        {#if hint}
          <span class="ml-1 mt-0.5 block text-sm opacity-60">
            {hint}
          </span>
        {/if}
      </label>
    {/each}
  </div>
</section>
