import { useState, useCallback } from "react";
import { ArrowLeftRight, Navigation2, Clock } from "lucide-react";
import { LocationSearch, type LocationResult } from "@/components/compare/LocationSearch";
import { RideMap } from "@/components/compare/RideMap";
import { ProviderCard } from "@/components/compare/ProviderCard";
import { estimateFares, PROVIDERS, type FareEstimate } from "@/components/compare/FareEngine";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Compare() {
  document.title = "Compare Rides — CabScan";
  const [pickup, setPickup] = useState<LocationResult | null>(null);
  const [destination, setDestination] = useState<LocationResult | null>(null);
  const [estimates, setEstimates] = useState<FareEstimate[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  const onRouteCalculated = useCallback(
    (distanceKm: number, durationMin: number) => {
      setRouteInfo({ distanceKm, durationMin });
      if (pickup && destination) {
        setEstimates(
          estimateFares(distanceKm, durationMin, pickup.lat, pickup.lon, destination.lat, destination.lon)
        );
      }
    },
    [pickup, destination]
  );

  function swap() {
    setPickup(destination);
    setDestination(pickup);
  }

  const indiaEstimates = estimates.filter((e) => e.provider.region === "india");
  const intlEstimates = estimates.filter((e) => e.provider.region === "international");

  const cheapest = estimates.length > 0
    ? estimates.reduce((a, b) => (a.fareMin < b.fareMin ? a : b)).provider.id
    : null;
  const fastest = estimates.length > 0
    ? estimates.reduce((a, b) => (a.etaMin < b.etaMin ? a : b)).provider.id
    : null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compare Rides</h1>
          <p className="text-muted-foreground">Enter your route to compare fares from 13+ providers</p>
        </div>

        <div className="grid lg:grid-cols-[400px,1fr] gap-6">
          {/* Left panel */}
          <div className="space-y-4">
            {/* Search inputs */}
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 space-y-3">
              <LocationSearch
                placeholder="Pickup location"
                value={pickup}
                onChange={setPickup}
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
                onChange={setDestination}
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
                      <div className="font-semibold">{routeInfo.distanceKm.toFixed(1)} km</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Drive time</div>
                      <div className="font-semibold">{Math.round(routeInfo.durationMin)} min</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Provider cards */}
            {estimates.length > 0 && (
              <div>
                <Tabs defaultValue="india">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="india" className="flex-1">India ({indiaEstimates.length})</TabsTrigger>
                    <TabsTrigger value="international" className="flex-1">International ({intlEstimates.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="india" className="space-y-3 mt-0">
                    {indiaEstimates
                      .sort((a, b) => a.fareMin - b.fareMin)
                      .map((e) => (
                        <ProviderCard
                          key={e.provider.id}
                          estimate={e}
                          isCheapest={e.provider.id === cheapest}
                          isFastest={e.provider.id === fastest}
                          pickupLat={pickup!.lat}
                          pickupLon={pickup!.lon}
                          destLat={destination!.lat}
                          destLon={destination!.lon}
                        />
                      ))}
                    {/* Local providers */}
                    <div className="rounded-2xl border border-border/50 bg-card/40 p-4">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Local Providers</div>
                      {[
                        { name: "Kashmir Taxi Union", phone: "+91-194-246-0000" },
                        { name: "Srinagar Airport Taxi", phone: "+91-194-303-3033" },
                        { name: "Delhi Local Taxi", phone: "+91-11-2336-5000" },
                      ].map((l) => (
                        <div key={l.name} className="flex items-center justify-between py-2 border-b last:border-0 border-border/30">
                          <div>
                            <div className="text-sm font-medium">{l.name}</div>
                            <div className="text-xs text-muted-foreground">{l.phone}</div>
                          </div>
                          <a href={`tel:${l.phone}`} className="text-xs text-primary hover:underline">Call</a>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="international" className="space-y-3 mt-0">
                    {intlEstimates
                      .sort((a, b) => a.fareMin - b.fareMin)
                      .map((e) => (
                        <ProviderCard
                          key={e.provider.id}
                          estimate={e}
                          isCheapest={e.provider.id === cheapest}
                          isFastest={e.provider.id === fastest}
                          pickupLat={pickup!.lat}
                          pickupLon={pickup!.lon}
                          destLat={destination!.lat}
                          destLon={destination!.lon}
                        />
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Empty state */}
            {!pickup && !destination && (
              <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center">
                <Navigation2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Enter pickup and destination to compare fares</p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ minHeight: 500 }}>
            <RideMap
              pickup={pickup}
              destination={destination}
              onRouteCalculated={onRouteCalculated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
