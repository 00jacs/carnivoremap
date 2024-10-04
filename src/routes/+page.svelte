<script lang="ts">
  import { fade } from 'svelte/transition';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import mapboxgl from 'mapbox-gl';
  import { Search, X } from 'lucide-svelte';
  import { PUBLIC_MAPBOX_KEY } from '$env/static/public';
  import { type PlaceFlag } from './form/form.ts';

  const DEFAULT_MARKER_SIZE = 50;

  interface Marker {
    id: string;
    title: string;
    description: string;
    flags: PlaceFlag[];
    iconSize?: [number, number];
    rating: number;
    location: {
      lat: number;
      lng: number;
    };
  }

  const markers: Marker[] = [
    {
      id: 'uuid-of-the-place-will-be-here',
      title: 'Gourmeat',
      description: 'A butcher shop',
      flags: ['butcher', 'rawDairy', 'restaurant'],
      rating: 4.8,
      location: {
        lat: -66.324462,
        lng: -16.024695
      }
    },
    {
      id: '2-uuid-of-the-place-will-be-here',
      title: 'Gourmeat',
      description: 'A butcher shop',
      flags: ['rawDairy'],
      rating: 4.8,
      location: {
        lat: -61.21582,
        lng: -15.971891
      }
    },
    {
      id: '3-uuid-of-the-place-will-be-here',
      title: 'Gourmeat',
      flags: ['restaurant'],
      description: 'A butcher shop',
      rating: 4.8,
      location: {
        lat: -63.292236,
        lng: -18.281518
      }
    },
    {
      id: '3-uuid-of-the-place-will-be-here',
      title: 'Fisherman',
      flags: ['fish'],
      description: 'A fish shop',
      rating: 4.8,
      location: {
        lat: -63.292236,
        lng: -18.281518
      }
    }
  ];

  const icons: Record<PlaceFlag, string> = {
    butcher: '🥩',
    fish: '🐟',
    dairy: '🥛',
    restaurant: '🍽️'
  };

  let loading = $state(false);

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

      const map = new mapboxgl.Map({
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

  let selectedPlace = $state<any>(null);
</script>

{#if loading}
  Loading...
{/if}

<div class="mx-auto max-w-3xl px-8 pt-12">
  <div>
    <h1 class="text-2xl font-bold md:text-3xl">Search our carnivore map</h1>
    <p class="mb-6 mt-2 text-sm opacity-70">
      Find our carnivore/ketovoore-friendly places added by our users. The
      website fully depends on voluntary contributions so feel free to add your
      review or <a href="/form/create-place" class="link">
        add a place of your choice.
      </a>
    </p>

    <label for="location-search" class="mb-8 block">
      <span class="mb-2 block font-bold">Search by your location</span>
      <div class="flex items-center justify-start gap-2">
        <input
          id="location-search"
          class="input input-bordered"
          placeholder="Your location..." />
        <button class="btn btn-outline"><Search /></button>
      </div>
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
