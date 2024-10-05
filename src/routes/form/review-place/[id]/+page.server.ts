import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, places } from '$lib/db';

export async function load({ params }) {
  if (params.id) {
    console.log('params id: ', params.id);
  } else {
    console.log('no params id...');
  }

  // @todo: autogenerate a slug for each place (5 random digits and slug based on name)
  let place;
  let _error;

  const takeUniqueOrThrow = <T extends any[]>(values: T): T[number] => {
    if (values.length !== 1) throw new Error("Found non unique or inexistent value")
    return values[0]!
  }

  try {
    place = await db.select().from(places).where(eq(places.id, params.id)).then(takeUniqueOrThrow);
  } catch (e) {
    _error = e;
  }

  if (_error || !place) {
    return error(404, 'Could not find a place with this id.');
  }

  console.log('place: ', place);

  return {
    place
  }
}
