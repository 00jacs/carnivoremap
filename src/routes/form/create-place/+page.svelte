<script lang="ts">
  import {
    form,
    clearFormCache,
    CreatePlaceFormSchema,
    type CreatePlaceForm,
    ZodError
  } from '../form';
  import GeneralForm from '../_components/general-form.svelte';
  import LocationForm from '../_components/location-form.svelte';

  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e?.preventDefault();

    loading = true;

    let parsed: CreatePlaceForm | null = null;

    try {
      parsed = CreatePlaceFormSchema.parse($form);
    } catch (e) {
      if (e instanceof ZodError) {
        const formattedError = e?.format();
        console.log(formattedError);
      }

      loading = false;
      error = 'Error! ' + JSON.stringify(e);
      return;
    }

    console.log('parsed: ', parsed);

    try {
      const response = await fetch('/form/create-place', {
        method: 'POST',
        body: JSON.stringify($form),
        headers: {
          'content-type': 'application/json'
        }
      });

      console.log('response: ', response);
    } catch (e) {
      console.log('error: ', e);
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{/if}

{#if error}
  <p>Error...</p>
{/if}

<form
  id="form-container"
  class="mx-auto max-w-2xl px-8 py-24"
  onsubmit={handleSubmit}>
  <span class="mb-2 block text-sm opacity-80">
    get +10 🥩 for your contribution
  </span>

  <h1 class="mb-6 text-xl font-bold xl:text-3xl">Add a new place</h1>

  <GeneralForm />
  <div class="divider mb-12 mt-10"></div>
  <LocationForm />

  <button type="submit" class="btn btn-primary">Submit...</button>
</form>

<div>Create place!</div>
