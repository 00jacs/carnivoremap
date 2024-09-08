import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

import { profiles, recipes, type RecipeFlag } from './schema';

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });

export { profiles, recipes, type RecipeFlag };
