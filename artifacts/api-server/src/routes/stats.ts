import { Router, type IRouter } from "express";
import { count, avg, sql } from "drizzle-orm";
import { db, poolRidesTable, userProfilesTable, joinRequestsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/rides", async (_req, res): Promise<void> => {
  const [totals] = await db
    .select({
      totalRides: count(poolRidesTable.id),
      avgRating: avg(poolRidesTable.driverRating),
    })
    .from(poolRidesTable);

  const [activeResult] = await db
    .select({ activeRides: count(poolRidesTable.id) })
    .from(poolRidesTable)
    .where(sql`${poolRidesTable.status} = 'active'`);

  const [passengerResult] = await db
    .select({ totalPassengers: count(joinRequestsTable.id) })
    .from(joinRequestsTable)
    .where(sql`${joinRequestsTable.status} = 'accepted'`);

  const [weekResult] = await db
    .select({ ridesThisWeek: count(poolRidesTable.id) })
    .from(poolRidesTable)
    .where(sql`${poolRidesTable.createdAt} >= NOW() - INTERVAL '7 days'`);

  // Top routes from DB
  const topRoutesRaw = await db
    .select({
      from: poolRidesTable.fromAddress,
      to: poolRidesTable.toAddress,
      cnt: count(poolRidesTable.id),
    })
    .from(poolRidesTable)
    .groupBy(poolRidesTable.fromAddress, poolRidesTable.toAddress)
    .orderBy(sql`count(${poolRidesTable.id}) DESC`)
    .limit(5);

  const topRoutes = topRoutesRaw.map((r) => ({
    from: r.from,
    to: r.to,
    count: Number(r.cnt),
  }));

  res.json({
    totalRides: Number(totals?.totalRides ?? 0),
    activeRides: Number(activeResult?.activeRides ?? 0),
    totalPassengers: Number(passengerResult?.totalPassengers ?? 0),
    citiesServed: 12,
    avgRating: Number(totals?.avgRating ?? 4.5),
    ridesThisWeek: Number(weekResult?.ridesThisWeek ?? 0),
    topRoutes,
  });
});

router.get("/stats/recent", async (_req, res): Promise<void> => {
  const recentRides = await db
    .select()
    .from(poolRidesTable)
    .orderBy(sql`${poolRidesTable.createdAt} DESC`)
    .limit(5);

  const recentJoins = await db
    .select()
    .from(joinRequestsTable)
    .orderBy(sql`${joinRequestsTable.createdAt} DESC`)
    .limit(5);

  const items = [
    ...recentRides.map((r) => ({
      id: r.id,
      type: "ride_posted",
      description: `${r.driverName} posted a ride from ${r.fromAddress} to ${r.toAddress}`,
      avatar: r.driverAvatar ?? null,
      createdAt: r.createdAt.toISOString(),
    })),
    ...recentJoins.map((j) => ({
      id: j.id + 10000,
      type: "ride_joined",
      description: `${j.passengerName} requested to join a ride`,
      avatar: j.passengerAvatar ?? null,
      createdAt: j.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  res.json(items);
});

export default router;
