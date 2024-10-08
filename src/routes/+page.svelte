<script lang="ts">
  import 'mapbox-gl/dist/mapbox-gl.css';
  import mapboxgl from 'mapbox-gl';
  import { getGeocoding } from '$lib/api/google-maps';
  import { Search, MapPinned } from 'lucide-svelte';
  import { PUBLIC_MAPBOX_KEY } from '$env/static/public';

  import { type PlaceFlag } from './form/form';
  import SelectedPlaceCard from './_components/selected-place-card.svelte';

  let { data } = $props();
  let { places } = data;

  const DEFAULT_MARKER_SIZE = 50;

  const icons: Record<PlaceFlag, string> = {
    butcher: '🥩',
    fish: '🐟',
    dairy: '🥛',
    honey: '🍯',
    restaurant: '🍽️'
  };

  let loading = $state(false);
  let map: mapboxgl.Map | null = null;
  let _markers: any[] = [];

  function addPlaceMarkerToMap(
    place: {
      id: string;
      flags: PlaceFlag[];
      coordinates: { x: number; y: number };
    },
    width = DEFAULT_MARKER_SIZE,
    height = DEFAULT_MARKER_SIZE
  ) {
    if (!map) {
      console.error('There is no map to add the place to.');
      return;
    }

    const el = document.createElement('div');

    el.id = `${place.id}`; // optimization: shorten this?
    el.className = 'map-marker';
    el.innerHTML =
      place.flags.length > 1 ? '📍' : icons?.[place.flags[0]] || '🤷🏻‍♂️';
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    el.addEventListener('click', () => {
      selectedPlace = place;
      setTimeout(() => {
        map?.resize();
      });

      setTimeout(() => {
        if (window.innerWidth <= 768) {
          // this is the threshold for md: in tailwindcss
          document.getElementById('selected-place')?.scrollIntoView();
        }
      }, 200);
    });

    // Add markers to the map.
    _markers.push(
      new mapboxgl.Marker(el)
        .setLngLat([place.coordinates.y, place.coordinates.x])
        .addTo(map)
    );
  }

  $effect(() => {
    loading = true;
    (async () => {
      // @todo: parse places with zod

      mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;

      map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [19.9267172, 50.0772341],
        zoom: 2
      });

      map.addControl(new mapboxgl.NavigationControl());

      for (const place of places) {
        addPlaceMarkerToMap(place);
      }

      loading = false;
    })();
  });

  let searchInput = $state<string>('');
  let selectedPlace = $state<any | null>(null);
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

  const filters = $state<{ key: PlaceFlag; label: string; checked: boolean }[]>(
    [
      {
        key: 'butcher',
        label: 'Butcher',
        checked: true
      },
      {
        key: 'dairy',
        label: 'Raw dairy',
        checked: true
      },
      {
        key: 'fish',
        label: 'Fish',
        checked: true
      },
      {
        key: 'honey',
        label: 'Honey',
        checked: true
      },
      {
        key: 'restaurant',
        label: 'Restaurant',
        checked: true
      }
    ]
  );

  function filterPlaces() {
    const activeFilters = filters
      .filter((filter) => filter.checked)
      .map((filter) => filter.key);

    const filteredPlaces =
      places?.filter((place) =>
        place.flags.some((flag) => activeFilters.includes(flag))
      ) || [];

    console.log('filtered places: ', filteredPlaces);

    const currentMarkerIds = _markers.map((_marker) =>
      _marker._element.getAttribute('id')
    );

    for (let i = 0; i < _markers.length; i++) {
      const marker = _markers[i];
      const markerId = marker._element.getAttribute('id');
      console.log('marker id: ', markerId);

      if (!filteredPlaces.find((place) => place.id === markerId)) {
        marker.remove();
        _markers.splice(i, 1);
        i--;
      }
    }

    if (!map) {
      console.error(
        'It seems that there is no map, so where should we add markers to?'
      );
      return;
    }

    // let's add all the non-existing markers
    for (const place of filteredPlaces) {
      if (!currentMarkerIds.includes(place.id)) {
        addPlaceMarkerToMap(place);
      }
    }

    console.log('filtered places: ', filteredPlaces);
    changedFilters = false;
    return filteredPlaces;
  }

  let changedFilters = $state(false);
</script>

{#if loading}
  Loading...
{/if}

<div class="mx-auto max-w-4xl px-8 pt-12">
  <div>
    <h1 class="text-2xl font-bold md:text-3xl">Search our carnivore map</h1>
    <p class="mb-6 mt-2 text-sm opacity-70">
      Find our carnivore/ketovore-friendly places added by our users. The
      website fully depends on voluntary contributions so feel free to <a
        href="/form/create-place"
        class="link">
        add a place of your choice.
      </a>
      or
      <a href="/contact" class="link">contact us</a>
      in case you have any feedback, questions, or reviews.
    </p>

    <label for="location-search" class="mb-8 block">
      <span class="mb-2 block font-bold">Search by location</span>
      <form
        class="flex flex-wrap items-center justify-between gap-2"
        onsubmit={handleSearchLocation}>
        <div class="flex items-center justify-start gap-2">
          <input
            id="location-search"
            class="input input-bordered w-72 max-w-[60%]"
            placeholder="Your location..."
            bind:value={searchInput} />

          <button
            type="submit"
            name="Search location button"
            class="btn btn-outline">
            <Search />
          </button>
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

    <div>
      <span class="mb-3 block font-bold">I'm looking for...</span>
      <div class="flex flex-wrap justify-start gap-x-4 gap-y-4 md:gap-x-0">
        {#each filters as filter, i}
          <label
            for="filter-{filter.key}"
            class="flex items-center justify-start gap-2">
            <span>{icons[filter.key]} {filter.label}</span>
            <input
              id="filter-{filter.key}"
              type="checkbox"
              class="checkbox checkbox-sm"
              onchange={() => (changedFilters = true)}
              bind:checked={filter.checked} />
          </label>

          <div class="divider divider-horizontal hidden md:flex"></div>

          {#if i === filters.length - 1}
            <button
              class="btn btn-sm {changedFilters ? 'btn-error' : 'btn-outline'}"
              onclick={filterPlaces}>
              Filter
            </button>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>

<div id="map-container" class="grid w-full grid-cols-12 md:pt-12">
  <div
    class="relative col-span-12 mt-12 h-[640px] max-h-[60vh] md:mt-0 md:max-h-[50vh] {selectedPlace
      ? 'overflow-hidden rounded-r-lg md:!col-span-6 xl:!col-span-8'
      : ''}">
    <div id="map" class="h-full w-full"></div>
  </div>

  {#if selectedPlace}
    <SelectedPlaceCard
      place={selectedPlace}
      close={() => {
        selectedPlace = null;
        setTimeout(() => {
          map?.resize();
        });
      }} />
  {/if}
</div>

<style lang="postcss">
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(.map-marker) {
    @apply block cursor-pointer border-0 p-0 text-2xl;
  }
</style>
