import { Loader } from '@googlemaps/js-api-loader';
import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

export const loader = new Loader({
  apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
  version: 'weekly'
});

export async function getGeocoding() {
  const { Geocoder } = await loader.importLibrary('geocoding');
  return Geocoder;
}

export async function getGeocodingAndMarker() {
  let _Geocoder, _AdvancedMarkerElement;

  await Promise.all([
    new Promise<void>(async (resolve) => {
      const { Geocoder } = await loader.importLibrary('geocoding');
      _Geocoder = Geocoder;
      resolve();
    }), new Promise<void>(async (resolve) => {
      const { AdvancedMarkerElement } = await loader.importLibrary('marker');
      _AdvancedMarkerElement = AdvancedMarkerElement;
      resolve();
    })
  ]);

  return {
    Geocoder: _Geocoder,
    AdvancedMarkerElement: _AdvancedMarkerElement
  }
}

export async function getGoogleMapsLibs() {
  let _Map, _Geocoder, _AdvancedMarkerElement;

  await Promise.all([
    new Promise<void>(async (resolve) => {
      const { Map } = await loader.importLibrary('maps');
      _Map = Map;
      resolve();
    }), new Promise<void>(async (resolve) => {
      const { Geocoder } = await loader.importLibrary('geocoding');
      _Geocoder = Geocoder;
      resolve();
    }), new Promise<void>(async (resolve) => {
      const { AdvancedMarkerElement } = await loader.importLibrary('marker');
      _AdvancedMarkerElement = AdvancedMarkerElement;
      resolve();
    })
  ]);

  return {
    Map: _Map,
    Geocoder: _Geocoder,
    AdvancedMarkerElement: _AdvancedMarkerElement
  }
}
