import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Users, Star, Briefcase, Music, Cigarette, Calendar } from "lucide-react";
import { useListRides } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function RideCard({ ride }: { ride: { id: number; fromAddress: string; toAddress: string; date: string; time: string; seatsLeft: number; farePerSeat: number; driverName: string; driverRating: number; driverTrips: number; luggageAllowed?: boolean; musicAllowed?: boolean; smokingAllowed?: boolean; driverAvatar?: string | null } }) {
  return (
    <Link href={`/pool/${ride.id}`}>
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group" data-testid={`card-ride-${ride.id}`}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg group-hover:bg-primary/20 transition-colors">
            {ride.driverName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <div className="font-semibold truncate">{ride.driverName}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {ride.driverRating.toFixed(1)} · {ride.driverTrips} trips
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-lg text-primary">₹{ride.farePerSeat}</div>
                <div className="text-xs text-muted-foreground">per seat</div>
              </div>
            </div>
            {/* Route */}
            <div className="space-y-1 mb-3">
              <div className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                <span className="truncate text-foreground">{ride.fromAddress}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-destructive mt-1 shrink-0" />
                <span className="truncate text-foreground">{ride.toAddress}</span>
              </div>
            </div>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ride.date} {ride.time}</div>
              <div className="flex items-center gap-1"><Users className="w-3 h-3" />{ride.seatsLeft} seats left</div>
              {ride.luggageAllowed && <Briefcase className="w-3 h-3" aria-label="Luggage OK" />}
              {ride.musicAllowed && <Music className="w-3 h-3" aria-label="Music OK" />}
              {!ride.smokingAllowed && <Cigarette className="w-3 h-3 opacity-40" aria-label="No smoking" />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PoolBrowse() {
  document.title = "CabScan Pool — Find Pool Rides";
  const [search, setSearch] = useState("");
  const { data: rides, isLoading } = useListRides({ status: "active" });

  const filtered = (rides || []).filter(
    (r) =>
      !search ||
      r.fromAddress.toLowerCase().includes(search.toLowerCase()) ||
      r.toAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">CabScan Pool</h1>
            <p className="text-muted-foreground">Find rides on your route</p>
          </div>
          <Link href="/pool/offer">
            <Button className="gap-2 shadow-lg shadow-primary/20" data-testid="button-offer-ride">
              <Plus className="w-4 h-4" /> Offer a Ride
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by city or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
            data-testid="input-pool-search"
          />
        </div>

        {/* Rides */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No rides found</h3>
            <p className="text-muted-foreground text-sm mb-6">Be the first to offer a ride on this route</p>
            <Link href="/pool/offer">
              <Button data-testid="button-offer-empty-state">Offer a Ride</Button>
            </Link>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">{filtered.length} ride{filtered.length !== 1 ? "s" : ""} available</div>
            {filtered.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
