<script lang="ts">
  import {
    form,
    clearFormCache,
    CreatePlaceFormSchema,
    type CreatePlaceForm,
    ZodError
  } from '../form';
  import { MapPinPlus } from 'lucide-svelte';
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
        for (const err in e.flatten()?.fieldErrors) {
          if (err?.length) {
            loading = false;
            error = err[0];
            alert(error);
            return;
          }
        }
      }

      loading = false;
      error = 'Error! ' + JSON.stringify(e);
      alert(error);
      return;
    }

    try {
      const response = await fetch('/form/create-place', {
        method: 'POST',
        body: JSON.stringify($form),
        headers: {
          'content-type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Could not send a request. Please contact support.');
      }
    } catch (e) {
      alert(e);
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{/if}

{#if error}
  <p>Error... {error}</p>
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
  <div class="divider mb-12 mt-10"></div>

  <button type="submit" class="btn btn-primary w-full">
    <MapPinPlus class="h-4 w-4" />
    Add place
  </button>
</form>
