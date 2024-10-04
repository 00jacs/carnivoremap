import { pgTable, uuid, timestamp, text, geometry, index, boolean } from "drizzle-orm/pg-core";

export const profiles = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  username: text('username').notNull().unique(),
  email: text('email').notNull()
});

export const places = pgTable('place', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  // general
  title: text('title'),
  description: text('description'),

  // flags
  flagButcher: boolean('flag_butcher'),
  flagFish: boolean('flag_fish'),
  flagDairy: boolean('flag_dairy'),
  flagHoney: boolean('flag_honey'),
  flagRestaurant: boolean('flag_restaurant'),

  // location-related
  streetAddress: text('street_address'),
  streetNumber: text('street_number'),
  postalCode: text('postal_code'),
  city: text('city'),
  country: text('country'),

  // location for PostGIS for fast indexing
  coordinates: geometry('coordinates', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
}, (t) => ({
  // spacial index required for PostGIS
  spatialIndex: index('spatial_index').using('gist', t.coordinates),
}));
