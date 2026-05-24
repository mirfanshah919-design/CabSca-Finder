import { Router, type IRouter } from "express";
import { eq, and, gte } from "drizzle-orm";
import { db, poolRidesTable, joinRequestsTable } from "@workspace/db";
import {
  ListRidesQueryParams,
  CreateRideBody,
  GetRideParams,
  GetRideResponse,
  UpdateRideParams,
  UpdateRideBody,
  DeleteRideParams,
  JoinRideParams,
  JoinRideBody,
  GetRideRequestsParams,
  UpdateJoinRequestParams,
  UpdateJoinRequestBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/rides", async (req, res): Promise<void> => {
  const parsed = ListRidesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { date, seats, status } = parsed.data;
  let query = db.select().from(poolRidesTable).$dynamic();

  const conditions = [];
  if (date) conditions.push(eq(poolRidesTable.date, date));
  if (seats) conditions.push(gte(poolRidesTable.seatsLeft, seats));
  if (status) conditions.push(eq(poolRidesTable.status, status));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const rides = await query.orderBy(poolRidesTable.createdAt);
  res.json(rides.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/rides", async (req, res): Promise<void> => {
  const parsed = CreateRideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const [ride] = await db
    .insert(poolRidesTable)
    .values({
      ...data,
      seatsLeft: data.seats,
      driverRating: 4.5,
      driverTrips: 0,
    })
    .returning();
  res.status(201).json({ ...ride, createdAt: ride.createdAt.toISOString() });
});

router.get("/rides/:id", async (req, res): Promise<void> => {
  const params = GetRideParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [ride] = await db
    .select()
    .from(poolRidesTable)
    .where(eq(poolRidesTable.id, params.data.id));
  if (!ride) {
    res.status(404).json({ error: "Ride not found" });
    return;
  }
  res.json(GetRideResponse.parse({ ...ride, createdAt: ride.createdAt.toISOString() }));
});

router.patch("/rides/:id", async (req, res): Promise<void> => {
  const params = UpdateRideParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateRideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [ride] = await db
    .update(poolRidesTable)
    .set(parsed.data)
    .where(eq(poolRidesTable.id, params.data.id))
    .returning();
  if (!ride) {
    res.status(404).json({ error: "Ride not found" });
    return;
  }
  res.json({ ...ride, createdAt: ride.createdAt.toISOString() });
});

router.delete("/rides/:id", async (req, res): Promise<void> => {
  const params = DeleteRideParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [ride] = await db
    .delete(poolRidesTable)
    .where(eq(poolRidesTable.id, params.data.id))
    .returning();
  if (!ride) {
    res.status(404).json({ error: "Ride not found" });
    return;
  }
  res.sendStatus(204);
});

router.post("/rides/:id/join", async (req, res): Promise<void> => {
  const params = JoinRideParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = JoinRideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [ride] = await db
    .select()
    .from(poolRidesTable)
    .where(eq(poolRidesTable.id, params.data.id));
  if (!ride) {
    res.status(404).json({ error: "Ride not found" });
    return;
  }
  if (ride.seatsLeft < parsed.data.seats) {
    res.status(400).json({ error: "Not enough seats available" });
    return;
  }
  const [joinReq] = await db
    .insert(joinRequestsTable)
    .values({ ...parsed.data, rideId: params.data.id, status: "pending" })
    .returning();
  res.json({ ...joinReq, createdAt: joinReq.createdAt.toISOString() });
});

router.get("/rides/:id/requests", async (req, res): Promise<void> => {
  const params = GetRideRequestsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const requests = await db
    .select()
    .from(joinRequestsTable)
    .where(eq(joinRequestsTable.rideId, params.data.id))
    .orderBy(joinRequestsTable.createdAt);
  res.json(requests.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.patch("/rides/:id/requests/:requestId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawRequestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
  const params = UpdateJoinRequestParams.safeParse({ id: rawId, requestId: rawRequestId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateJoinRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [joinReq] = await db
    .update(joinRequestsTable)
    .set({ status: parsed.data.status })
    .where(eq(joinRequestsTable.id, params.data.requestId))
    .returning();
  if (!joinReq) {
    res.status(404).json({ error: "Join request not found" });
    return;
  }
  // If accepted, reduce seats left
  if (parsed.data.status === "accepted") {
    const [ride] = await db.select().from(poolRidesTable).where(eq(poolRidesTable.id, params.data.id));
    if (ride) {
      await db
        .update(poolRidesTable)
        .set({ seatsLeft: Math.max(0, ride.seatsLeft - joinReq.seats) })
        .where(eq(poolRidesTable.id, params.data.id));
    }
  }
  res.json({ ...joinReq, createdAt: joinReq.createdAt.toISOString() });
});

export default router;
