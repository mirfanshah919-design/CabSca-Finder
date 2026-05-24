import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const joinRequestsTable = pgTable("join_requests", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull(),
  passengerName: text("passenger_name").notNull(),
  passengerAvatar: text("passenger_avatar"),
  seats: integer("seats").notNull().default(1),
  pickupAddress: text("pickup_address"),
  status: text("status").notNull().default("pending"),
  profileId: integer("profile_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertJoinRequestSchema = createInsertSchema(joinRequestsTable).omit({ id: true, createdAt: true });
export type InsertJoinRequest = z.infer<typeof insertJoinRequestSchema>;
export type JoinRequest = typeof joinRequestsTable.$inferSelect;
