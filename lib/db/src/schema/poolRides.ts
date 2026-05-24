import { pgTable, serial, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const poolRidesTable = pgTable("pool_rides", {
  id: serial("id").primaryKey(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  fromLat: real("from_lat").notNull(),
  fromLng: real("from_lng").notNull(),
  toLat: real("to_lat").notNull(),
  toLng: real("to_lng").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  seats: integer("seats").notNull(),
  seatsLeft: integer("seats_left").notNull(),
  status: text("status").notNull().default("active"),
  driverName: text("driver_name").notNull(),
  driverAvatar: text("driver_avatar"),
  driverRating: real("driver_rating").notNull().default(4.5),
  driverTrips: integer("driver_trips").notNull().default(0),
  farePerSeat: real("fare_per_seat").notNull(),
  luggageAllowed: boolean("luggage_allowed").notNull().default(true),
  smokingAllowed: boolean("smoking_allowed").notNull().default(false),
  musicAllowed: boolean("music_allowed").notNull().default(true),
  genderPreference: text("gender_preference"),
  notes: text("notes"),
  profileId: integer("profile_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPoolRideSchema = createInsertSchema(poolRidesTable).omit({ id: true, createdAt: true });
export type InsertPoolRide = z.infer<typeof insertPoolRideSchema>;
export type PoolRide = typeof poolRidesTable.$inferSelect;
