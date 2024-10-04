<script lang="ts">
  import { fade } from 'svelte/transition';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import mapboxgl from 'mapbox-gl';
  import { getGeocoding } from '$lib/api/google-maps';
  import { Search, X, MapPinned } from 'lucide-svelte';
  import { PUBLIC_MAPBOX_KEY } from '$env/static/public';
  import { type PlaceFlag } from './form/form.ts';

  const DEFAULT_MARKER_SIZE = 50;

  const icons: Record<PlaceFlag, string> = {
    butcher: '🥩',
    fish: '🐟',
    dairy: '🥛',
    restaurant: '🍽️'
  };

  let loading = $state(false);
  let map: mapboxgl.Map | null = null;

  $effect(() => {
    loading = true;
    (async () => {
      const response = await fetch('/', {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Error...', response);
        return;
      }

      const places = await response.json();
      // @todo: parse places with zod
      console.log('places: ', places);

      const markers = places.map((place) => ({
        id: place.id,
        title: place.title,
        description: place.description,
        flags: Object.keys(place)
          .filter((key) => key.startsWith('flag') && place[key])
          .map((key) => key.split('flag')[1].toLowerCase()),
        location: {
          lat: place.coordinates.x,
          lng: place.coordinates.y
        }
      }));

      // mapbox
      mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;

      map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [19.9267172, 50.0772341],
        zoom: 2
      });

      map.addControl(new mapboxgl.NavigationControl());

      // Add markers to the map.
      for (const marker of markers) {
        // Create a DOM element for each marker.
        const el = document.createElement('div');
        const width = marker?.iconSize?.[0] || DEFAULT_MARKER_SIZE;
        const height = marker?.iconSize?.[1] || DEFAULT_MARKER_SIZE;

        el.className = 'map-marker';
        el.innerHTML = icons?.[marker.flags[0]] || '🤷🏻‍♂️';
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;

        el.addEventListener('click', () => {
          selectedPlace = marker;
        });

        // Add markers to the map.
        new mapboxgl.Marker(el)
          .setLngLat([marker.location.lng, marker.location.lat])
          .addTo(map);
      }

      // console.log(map);
      loading = false;
    })();
  });

  let searchInput = $state<string>('');
  let selectedPlace = $state<any>(null);
  let geocoder: google.maps.Geocoder;

  $effect(() => {
    (async () => {
      const Geocoder = await getGeocoding();
      geocoder = new Geocoder();
    })();
  });

  function getUserLocation() {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          map?.flyTo({
            center: [lng, lat],
            zoom: 10
          });
        },
        (error) => {
          console.error('There was an error getting your geolocation: ', error);
          alert(
            'There was an error getting your geolocation. Please try entering your address'
          );
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser');
    }
  }

  function handleSearchLocation(e?: SubmitEvent) {
    e?.preventDefault();

    if (!e) {
      getUserLocation();
    } else {
      geocoder?.geocode(
        {
          address: searchInput
        },
        function (results, status) {
          if (status == 'OK') {
            if (!results?.[0] || !results?.[0]?.geometry?.location) {
              alert('Error when getting geometry location...');
              return;
            }

            map?.flyTo({
              center: [
                results[0].geometry.location.lng(),
                results[0].geometry.location.lat()
              ],
              zoom: 10
            });
          } else {
            alert(
              'Geocode was not successful for the following reason: ' + status
            );
          }
        }
      );
    }

    console.log('searching for place...', searchInput);
  }
</script>

{#if loading}
  Loading...
{/if}

<div class="mx-auto max-w-3xl px-8 pt-12">
  <div>
    <h1 class="text-2xl font-bold md:text-3xl">Search our carnivore map</h1>
    <p class="mb-6 mt-2 text-sm opacity-70">
      Find our carnivore/ketovore-friendly places added by our users. The
      website fully depends on voluntary contributions so feel free to add your
      review or <a href="/form/create-place" class="link">
        add a place of your choice.
      </a>
    </p>

    <label for="location-search" class="mb-8 block">
      <span class="mb-2 block font-bold">Search by location</span>

      <form
        class="flex items-center justify-between gap-2"
        onsubmit={handleSearchLocation}>
        <div class="flex items-center justify-start gap-2">
          <input
            id="location-search"
            class="min-w-sm input input-bordered w-72"
            placeholder="Your location..."
            bind:value={searchInput} />

          <button type="submit" class="btn btn-outline"><Search /></button>
        </div>

        <button
          type="button"
          class="btn btn-outline"
          onclick={() => handleSearchLocation()}>
          <MapPinned class="h-4 w-4" />
          Search by my current location
        </button>
      </form>
    </label>
  </div>
</div>

<div class="mt-12 w-full {selectedPlace ? 'grid grid-cols-12' : ''}">
  <div
    id="map"
    class="col-span-8 h-[640px] max-h-[60vh] w-full"
    class:rounded-r={selectedPlace}>
  </div>

  <!-- On mobile, this should be a pop-up -->
  {#if selectedPlace}
    <div class="col-span-4 px-4" transition:fade>
      <div class="relative rounded border px-4 py-3">
        <button
          class="absolute right-4 top-4"
          onclick={() => (selectedPlace = null)}>
          <X class="h-4 w-4" />
        </button>
        <h2 class="font-bold md:text-2xl">{selectedPlace.title}</h2>
        <p class="mb-4 mt-1 text-sm">{selectedPlace.description}</p>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.map-marker) {
    @apply block cursor-pointer border-0 p-0 text-2xl;
  }
</style>
