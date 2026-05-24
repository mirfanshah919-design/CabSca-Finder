import { useState } from "react";
import { Link } from "wouter";
import { Search, Users, Star, Calendar, Briefcase, Music, ArrowRight } from "lucide-react";
import { useListRides } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function PoolFind() {
  document.title = "Find a Ride — CabScan Pool";
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("1");
  const [searched, setSearched] = useState(false);

  const { data: rides, isLoading } = useListRides({
    ...(date ? { date } : {}),
    ...(seats ? { seats: parseInt(seats) } : {}),
    status: "active",
  });

  const filtered = (rides || []).filter(
    (r) =>
      (!from || r.fromAddress.toLowerCase().includes(from.toLowerCase())) &&
      (!to || r.toAddress.toLowerCase().includes(to.toLowerCase()))
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find a Ride</h1>
          <p className="text-muted-foreground">Search available pool rides on your route</p>
        </div>

        {/* Search form */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input placeholder="City or area" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="input-find-from" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input placeholder="City or area" value={to} onChange={(e) => setTo(e.target.value)} data-testid="input-find-to" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} data-testid="input-find-date" />
            </div>
            <div className="space-y-2">
              <Label>Min seats</Label>
              <Input type="number" min={1} max={6} value={seats} onChange={(e) => setSeats(e.target.value)} data-testid="input-find-seats" />
            </div>
          </div>
          <Button className="w-full gap-2 shadow-lg shadow-primary/20" onClick={() => setSearched(true)} data-testid="button-search-rides">
            <Search className="w-4 h-4" /> Search Rides
          </Button>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        )}

        {!isLoading && searched && filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border/50">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No rides found</h3>
            <p className="text-sm text-muted-foreground mb-6">No rides match your search. Try different dates or be the first to offer this route.</p>
            <Link href="/pool/offer">
              <Button data-testid="button-offer-no-results">Offer this Ride <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{filtered.length} ride{filtered.length !== 1 ? "s" : ""} found</div>
            {filtered.map((ride) => (
              <Link href={`/pool/${ride.id}`} key={ride.id}>
                <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer" data-testid={`card-find-ride-${ride.id}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
                      {ride.driverName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold">{ride.driverName}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {ride.driverRating.toFixed(1)} · {ride.driverTrips} trips
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">₹{ride.farePerSeat}</div>
                          <div className="text-xs text-muted-foreground">/ seat</div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm mb-3">
                        <span className="truncate text-muted-foreground">{ride.fromAddress}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="truncate text-muted-foreground">{ride.toAddress}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ride.date} {ride.time}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ride.seatsLeft} seats</span>
                        {ride.luggageAllowed && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />Luggage OK</span>}
                        {ride.musicAllowed && <span className="flex items-center gap-1"><Music className="w-3 h-3" />Music</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
