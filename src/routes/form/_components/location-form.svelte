<script lang="ts">
  import { form } from '../form';
  import { MapPin, MapPinCheck, MapPinCheckInside, X } from 'lucide-svelte';

  import { Loader } from '@googlemaps/js-api-loader';
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

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

  let popupEl: HTMLDialogElement | null;
  let isLocationConfirmed = $state(false);

  let map;
  let geocoder;
  let coordinates;
  let _AdvancedMarkerElement;

  async function handleConfirmLocation() {
    for (const key of Object.keys($form.location)) {
      if (key !== 'lat' && key !== 'lng' && !$form.location[key]) {
        alert(`Please fill in all the location fields: ${key}`);
        return;
      }
    }
    popupEl?.showModal();
    // @todo: consider showing loading screen in the popup

    const loader = new Loader({
      apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    });

    await loader.load();

    const { Map } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;

    map = new Map(document.getElementById('map') as HTMLElement, {
      mapId: 'confirmation-map-id',
      center: { lat: -34.397, lng: 150.644 },
      zoom: 15
    });

    const { LatLngBounds } = (await google.maps.importLibrary(
      'core'
    )) as google.maps.CoreLibrary;
    const { Geocoder } = (await google.maps.importLibrary(
      'geocoding'
    )) as google.maps.GeocodingLibrary;

    geocoder = new Geocoder();

    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    _AdvancedMarkerElement = AdvancedMarkerElement;

    geocoder.geocode(
      {
        address: `${$form.location.streetAddress} ${$form.location.streetNumber}, ${$form.location.city} ${$form.location.postalCode}, ${$form.location.country}`
      },
      function (results, status) {
        console.log('results: ', results[0]);
        console.log(
          'results location geometry to json: ',
          results[0].geometry.location.toJSON()
        );

        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          var marker = new _AdvancedMarkerElement({
            map: map,
            position: results[0].geometry.location
          });

          coordinates = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
        } else {
          alert(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      }
    );
  }
</script>

<dialog id="confirm-map-modal" class="modal" bind:this={popupEl}>
  <div class="modal-box">
    <button
      type="button"
      class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
      onclick={() => popupEl?.close()}>
      ✕
    </button>

    <h2 class="mb-2 text-xl font-bold md:text-2xl">Confirm the location</h2>

    <p class="mb-6 opacity-80">
      Please confirm - is that the right location of the place that you're
      trying to add?
    </p>

    <div
      id="map"
      class="h-96 max-h-[50%] w-full rounded border border-base-300">
    </div>

    <p class="my-4 text-sm">
      If that's not the correct location, please try to enter the address in
      another way so that Google Maps can process it correctly.
    </p>

    <div class="mt-6 flex items-center justify-end gap-2">
      <button
        type="button"
        class="btn btn-outline"
        onclick={() => {
          isLocationConfirmed = false;
          popupEl?.close();
        }}>
        <X class="h-4 w-4" />Cancel
      </button>
      <button
        type="button"
        class="btn btn-primary"
        onclick={() => {
          isLocationConfirmed = true;
          popupEl?.close();
          $form.location.lat = coordinates.lat;
          $form.location.lng = coordinates.lng;
        }}>
        <MapPinCheckInside class="h-4 w-4" />Confirm location
      </button>
    </div>
  </div>
</dialog>

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
    onclick={handleConfirmLocation}>
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
