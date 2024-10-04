import { error, json } from '@sveltejs/kit';
import { db, places } from '$lib/db';

export async function GET() {
  try {
    const allPlaces = await db.select().from(places);
    console.log('all places: ', allPlaces);

    return json(allPlaces);
  } catch (e) {
    console.error('Error fetching from database: ', e);
    return error(500, 'Error processing your request. Try again later.');
  }
}

