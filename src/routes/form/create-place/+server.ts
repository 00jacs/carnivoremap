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

  try {
    await db.insert(places).values({
      ...data.general,
      ...data.location,
      coordinates: { x: data.location.lat, y: data.location.lng }
    });
  } catch (e) {
    console.warn('Could not insert into database: ', e);
    return error(500, 'Could not insert into database?');
  }

  console.log('success!')

  return json(data);
}
