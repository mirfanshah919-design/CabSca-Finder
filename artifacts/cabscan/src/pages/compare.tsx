import { useState, useCallback, useRef } from "react";
import { ArrowLeftRight, Navigation2, Clock, Rocket, Info } from "lucide-react";
import { LocationSearch, type LocationResult } from "@/components/compare/LocationSearch";
import { RideMap } from "@/components/compare/RideMap";
import { ProviderCard } from "@/components/compare/ProviderCard";
import {
  PROVIDER_TIERS,
  getRouteData,
  openAllApps,
  type DeepLinkParams,
} from "@/components/compare/ProviderTiers";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const INDIA_PROVIDERS = PROVIDER_TIERS.filter((p) => p.regions.includes("india")).sort(
  (a, b) => a.tier - b.tier
);
const INTL_PROVIDERS = PROVIDER_TIERS.filter((p) =>
  p.regions.some((r) => r !== "india")
).sort((a, b) => a.tier - b.tier);

export default function Compare() {
  document.title = "Compare Rides — CabScan";

  const [pickup, setPickup] = useState<LocationResult | null>(null);
  const [destination, setDestination] = useState<LocationResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
  } | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const routeCalcRef = useRef<AbortController | null>(null);

  const handleRouteCalculated = useCallback(
    async (mapDistKm: number, mapDurMin: number, pLat: number, pLng: number, dLat: number, dLng: number) => {
      // Use map's OSRM result immediately, then try OpenRouteService upgrade
      setRouteInfo({ distanceKm: mapDistKm, durationMin: mapDurMin });
      setLoadingRoute(true);

      if (routeCalcRef.current) routeCalcRef.current.abort();
      routeCalcRef.current = new AbortController();

      try {
        const better = await getRouteData(pLat, pLng, dLat, dLng);
        setRouteInfo(better);
      } catch {
        // keep OSRM value
      } finally {
        setLoadingRoute(false);
      }
    },
    []
  );

  // Wire the RideMap callback to pass coords through
  const onMapRoute = useCallback(
    (distanceKm: number, durationMin: number) => {
      if (pickup && destination) {
        handleRouteCalculated(
          distanceKm,
          durationMin,
          pickup.lat,
          pickup.lon,
          destination.lat,
          destination.lon
        );
      }
    },
    [pickup, destination, handleRouteCalculated]
  );

  function swap() {
    setPickup(destination);
    setDestination(pickup);
    setRouteInfo(null);
  }

  const hasRoute = !!routeInfo && !!pickup && !!destination;

  const params: DeepLinkParams | null = hasRoute
    ? {
        pickupLat: pickup!.lat,
        pickupLng: pickup!.lon,
        dropLat: destination!.lat,
        dropLng: destination!.lon,
      }
    : null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compare Rides</h1>
          <p className="text-muted-foreground">
            Enter your route — we'll show every option, sorted cheapest first
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px,1fr] gap-6">
          {/* ── Left panel ── */}
          <div className="space-y-4">
            {/* Search inputs */}
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 space-y-3">
              <LocationSearch
                placeholder="Pickup location"
                value={pickup}
                onChange={(v) => { setPickup(v); setRouteInfo(null); }}
                icon="pickup"
                data-testid="input-pickup"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t border-dashed border-border/60" />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-8 h-8 shrink-0"
                  onClick={swap}
                  data-testid="button-swap-locations"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </Button>
                <div className="flex-1 border-t border-dashed border-border/60" />
              </div>
              <LocationSearch
                placeholder="Destination"
                value={destination}
                onChange={(v) => { setDestination(v); setRouteInfo(null); }}
                icon="destination"
                data-testid="input-destination"
              />
            </div>

            {/* Route info */}
            {routeInfo && (
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Navigation2 className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                      <div className="font-semibold">
                        {loadingRoute ? "…" : `${routeInfo.distanceKm} km`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Drive time</div>
                      <div className="font-semibold">
                        {loadingRoute ? "…" : `${routeInfo.durationMin} min`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Provider lists */}
            {hasRoute && params ? (
              <div>
                {/* Open All Apps */}
                <Button
                  className="w-full mb-4 gap-2 shadow-lg shadow-primary/20"
                  size="lg"
                  onClick={() => openAllApps(INDIA_PROVIDERS, params)}
                  data-testid="button-open-all-apps"
                >
                  <Rocket className="w-4 h-4" />
                  Open Top 3 Apps Simultaneously
                </Button>

                <Tabs defaultValue="india">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="india" className="flex-1">
                      India ({INDIA_PROVIDERS.length})
                    </TabsTrigger>
                    <TabsTrigger value="international" className="flex-1">
                      International ({INTL_PROVIDERS.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="india" className="space-y-3 mt-0">
                    {INDIA_PROVIDERS.map((p, i) => (
                      <ProviderCard
                        key={p.id}
                        provider={p}
                        distanceKm={routeInfo!.distanceKm}
                        durationMin={routeInfo!.durationMin}
                        index={i}
                        params={params}
                      />
                    ))}

                    {/* Local operators */}
                    <div className="rounded-2xl border border-border/50 bg-card/40 p-4">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Local Operators
                      </div>
                      {[
                        { name: "Kashmir Taxi Union", phone: "+91-194-246-0000" },
                        { name: "Srinagar Airport Taxi", phone: "+91-194-303-3033" },
                        { name: "Delhi Local Taxi", phone: "+91-11-2336-5000" },
                      ].map((l) => (
                        <div
                          key={l.name}
                          className="flex items-center justify-between py-2 border-b last:border-0 border-border/30"
                        >
                          <div>
                            <div className="text-sm font-medium">{l.name}</div>
                            <div className="text-xs text-muted-foreground">{l.phone}</div>
                          </div>
                          <a href={`tel:${l.phone}`} className="text-xs text-primary hover:underline">
                            Call
                          </a>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="international" className="space-y-3 mt-0">
                    {INTL_PROVIDERS.map((p, i) => (
                      <ProviderCard
                        key={p.id}
                        provider={p}
                        distanceKm={routeInfo!.distanceKm}
                        durationMin={routeInfo!.durationMin}
                        index={i}
                        params={params}
                      />
                    ))}
                  </TabsContent>
                </Tabs>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 mt-4 px-3 py-3 rounded-xl bg-muted/30 border border-border/40">
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    Fares shown in provider apps are live and accurate. CabScan shows travel
                    time and distance only. Tap any provider to see real-time pricing.
                  </p>
                </div>
              </div>
            ) : (
              /* Empty state — loading skeletons while route is computing */
              pickup && destination && !routeInfo ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center">
                  <Navigation2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Enter pickup and destination to compare rides
                  </p>
                </div>
              )
            )}
          </div>

          {/* ── Map ── */}
          <div
            className="rounded-2xl border border-border/50 overflow-hidden"
            style={{ minHeight: 500 }}
          >
            <RideMap
              pickup={pickup}
              destination={destination}
              onRouteCalculated={onMapRoute}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
