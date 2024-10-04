import { pgTable, uuid, timestamp, text, geometry, index } from "drizzle-orm/pg-core";

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

  title: text('title'),
  description: text('description'),
  streetAddress: text('street_address'),
  streetNumber: text('street_number'),
  postalCode: text('postal_code'),
  city: text('city'),
  country: text('country'),

  coordinates: geometry('coordinates', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
}, (t) => ({
  spatialIndex: index('spatial_index').using('gist', t.coordinates),
}));
