import { db, places } from '$lib/db';

export async function load() {
  // @todo: when there are more places to fetch (50+)
  // optimize this with PostGIS; for initial traffic it should be ok
  const allPlaces = await db.select().from(places);

  return {
    places: allPlaces.map(place => ({
      ...place,
      flags: Object.keys(place)
        .filter(key => key.startsWith('flag') && (place as any)[key])
        .map(key => key.split('flag')[1].toLowerCase())
    }))
  }
};

