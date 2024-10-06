<script lang="ts">
  import { form } from '../form';

  const fields = [
    {
      key: 'name',
      label: 'Your name',
      placeholder: 'John Smith',
      hint: 'This will not be public. Only for us to reach out to you.'
    },
    {
      key: 'email',
      label: 'Your email',
      placeholder: 'johnsmith@gmail.com',
      hint: 'This will not be public. Only for us to reach out to you.'
    },
    {
      key: 'message',
      label: 'Message',
      placeholder:
        "Max 400 characters - Is there anything that you'd like to add?",
      hint: 'This will not be public.'
    }
  ] as const;
</script>

<div>
  <h2 class="mb-2 text-xl font-bold md:text-2xl">Your information</h2>
  <p class="mb-6 opacity-70">
    As you're adding a new listing, please provide us with basic information
    about you so we can reach (only in case this listing is reported, we will
    not spam you with emails).
  </p>

  <div class="flex flex-col gap-6">
    {#each fields as field}
      <label for="field-author-{field.key}">
        <span class="mb-1 block font-bold">{field.label}</span>
        {#if field.key === 'message'}
          <textarea
            id="field-author-{field.key}"
            class="textarea textarea-bordered max-h-32 min-h-12 w-full"
            placeholder={field.placeholder}
            bind:value={$form.author[field.key]}>
          </textarea>
        {:else}
          <input
            id="field-author-{field.key}"
            class="input input-bordered w-full"
            placeholder={field.placeholder}
            bind:value={$form.author[field.key]} />
        {/if}
      </label>
    {/each}
  </div>
</div>
