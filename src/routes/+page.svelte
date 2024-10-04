<script lang="ts">
  import 'mapbox-gl/dist/mapbox-gl.css';
  import mapboxgl from 'mapbox-gl';
  import { PUBLIC_MAPBOX_KEY } from '$env/static/public';

  const DEFAULT_MARKER_SIZE = 50;

  type MarkerFlag = 'butcher' | 'fish' | 'rawDairy' | 'restaurant';

  interface Marker {
    id: string;
    title: string;
    description: string;
    flags: MarkerFlag[];
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

  const icons: Record<MarkerFlag, string> = {
    butcher: '🥩',
    fish: '🐟',
    rawDairy: '🥛',
    restaurant: '🍽️'
  };

  $effect(() => {
    (async () => {
      const response = await fetch('/', {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      });

      console.log('response: ', response);

      if (response.status !== 200) {
        console.error('Error...', response);
        return;
      }

      console.log('fetched places: ', response.body);

      // mapbox
      mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;

      const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-65.017, -16.457],
        zoom: 5
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
          window.alert(marker.title);
        });

        // Add markers to the map.
        new mapboxgl.Marker(el)
          .setLngLat([marker.location.lat, marker.location.lng])
          .addTo(map);
      }

      // console.log(map);
    })();
  });
</script>

<div>Map of places!</div>
<div id="map" style="height: 500px; width: 500px;"></div>

<style lang="postcss">
  :global(.map-marker) {
    @apply block cursor-pointer border-0 p-0 text-2xl;
  }
</style>
