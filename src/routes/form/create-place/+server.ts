import { error, json } from '@sveltejs/kit';
import { CreatePlaceFormSchema, type CreatePlaceForm } from '../form';
import { db, places } from '$lib/db';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const input = await request.json();

  const result = CreatePlaceFormSchema.safeParse(input);
  console.log('result of parsing: ', result);

  const { success, data, error: formError } = CreatePlaceFormSchema.safeParse(input);

  if (!success) {
    console.info('[create-place/server.ts] Could not parse the user data: ', formError);
    return error(400, formError);
  }

  console.log('result data: ', data);

  if (!data.location.lat || !data.location.lng) {
    console.error('[create-place/server.ts] Strange? Received data without lat and lng.');
    return error(400, 'Please confirm the location of the place before submitting it. We need to process its exact coordinates.');
  }

  try {
    await db.insert(places).values({
      ...data.general,
      ...data.location,
      coordinates: { x: +data.location.lat, y: +data.location.lng },

      flagButcher: data.general.flags.includes('butcher'),
      flagFish: data.general.flags.includes('fish'),
      flagDairy: data.general.flags.includes('dairy'),
      flagHoney: data.general.flags.includes('honey'),
      flagRestaurant: data.general.flags.includes('restaurant'),
    });
  } catch (e) {
    console.warn('Could not insert into database: ', e);
    return error(500, 'Could not insert into database?');
  }

  console.log('success!')

  return json(data);
}
