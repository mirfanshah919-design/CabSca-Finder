# CabScan

A global mobility-tech platform with ride fare comparison and carpooling. Compare fares from 13+ ride providers globally and share rides via CabScan Pool.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/cabscan run dev` — run the frontend (port 23010, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `GEOAPIFY_API_KEY`, `VITE_GEOAPIFY_API_KEY`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS v4, wouter routing, @tanstack/react-query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (5 tables: pool_rides, join_requests, user_profiles, reviews, messages)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Maps: Leaflet + OpenStreetMap + OSRM routing
- Location search: Geoapify (primary) + Nominatim (fallback)
- Charts: Recharts (admin dashboard)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-zod/src/generated/api.ts` — generated Zod validators for routes
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/db/src/schema/` — Drizzle ORM schema (source of truth for DB)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/cabscan/src/pages/` — all frontend pages
- `artifacts/cabscan/src/components/` — shared components (layout, compare, ui)

## Architecture decisions

- Contract-first OpenAPI: all routes, types, and validators are generated from `openapi.yaml`
- Fare engine runs entirely client-side (no API call) using FareEngine.ts pricing rules
- Location search: tries Geoapify first (better quality), falls back to Nominatim (open, no key)
- Deep links open provider apps with route pre-filled; 1.5s timeout fallback to web URL
- Dark theme default with cyan primary; light mode toggle persisted in localStorage

## Product

- **Ride Compare**: Enter any pickup/destination → see fare estimates from 12+ providers → tap to open the cheapest app. Leaflet map shows route via OSRM. Surge pricing, night rates, airport surcharges all modeled.
- **CabScan Pool**: BlaBlaCar-style carpooling. Offer/find rides, join requests, in-ride chat, SOS button, share trip, driver profiles with ratings.
- **Admin Dashboard**: Live stats, top routes chart, manage all rides and profiles.
- **Static pages**: About, Blog, Contact, Privacy, Terms, Safety.

## User preferences

- Contact email: info.cabscan@gmail.com
- Dark mode default
- Cyan (#06b6d4) primary color

## Gotchas

- VITE_GEOAPIFY_API_KEY must be set for frontend location search (separate from GEOAPIFY_API_KEY)
- Leaflet default icon URLs set to CDN (unpkg) to avoid asset bundling issues
- Route `/pool/:id` must be after `/pool/offer` and `/pool/find` in the wouter Switch
- API server runs `build` then `start` in dev mode (via esbuild, not ts-node)
- Do not use `pnpm run dev` at workspace root — use workflow restart instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
