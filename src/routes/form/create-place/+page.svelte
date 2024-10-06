<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    form,
    clearForm,
    CreatePlaceFormSchema,
    type CreatePlaceForm,
    ZodError
  } from '../form';
  import { MapPinPlus } from 'lucide-svelte';
  import GeneralForm from '../_components/general-form.svelte';
  import LocationForm from '../_components/location-form.svelte';
  import AuthorForm from '../_components/author-form.svelte';

  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e?.preventDefault();

    loading = true;

    if (!$form.location.lat || !$form.location.lng) {
      alert('Please confirm the location before you submit the form');
      return;
    }

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

      const insertedPlace = (await response.json())?.[0];

      if (insertedPlace) {
        clearForm();

        alert('Place has been successfully added!');
        goto('/form/create-place/thanks');
      } else {
        throw new Error(
          'Could not retrieve a place from the database... Try again later'
        );
      }
    } catch (e) {
      alert(e);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>CarnivoreMap - Add new listing</title>
</svelte:head>

{#if loading}
  <!-- @todo -->
  <p>Loading...</p>
{/if}

{#if error}
  <!-- @todo -->
  <p>Error... {error}</p>
{/if}

<form
  id="form-container"
  class="mx-auto max-w-4xl px-8 py-12"
  onsubmit={handleSubmit}>
  <!--
  <span class="mb-2 block text-sm opacity-80">
    get +10 🥩 for your contribution
  </span>
  -->

  <h1 class="mb-6 text-xl font-bold md:text-3xl">Add a new place</h1>

  <GeneralForm />
  <div class="divider mb-12 mt-10"></div>
  <LocationForm />
  <div class="divider mb-8 mt-10"></div>
  <AuthorForm />

  <button type="submit" class="btn btn-primary mt-10 w-full">
    <MapPinPlus class="h-4 w-4" />
    Add place
  </button>
</form>
