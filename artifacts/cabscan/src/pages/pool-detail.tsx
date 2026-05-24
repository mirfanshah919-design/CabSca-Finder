import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Star, Users, Shield, MapPin, Send, AlertTriangle, Share2 } from "lucide-react";
import {
  useGetRide,
  useListMessages,
  useCreateMessage,
  useJoinRide,
  getGetRideQueryKey,
  getListMessagesQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";

function PoolMap({ fromLat, fromLng, toLat, toLng }: { fromLat: number; fromLng: number; toLat: number; toLng: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      const map = L.map(mapRef.current!, { zoom: 11, center: [fromLat, fromLng], zoomControl: false, attributionControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

      const pickupIcon = L.divIcon({ html: `<div style="width:12px;height:12px;border-radius:50%;background:#06b6d4;border:2px solid white;box-shadow:0 0 6px rgba(6,182,212,0.8)"></div>`, className: "", iconSize: [12, 12], iconAnchor: [6, 6] });
      const destIcon = L.divIcon({ html: `<div style="width:12px;height:12px;border-radius:50%;background:#ef4444;border:2px solid white;box-shadow:0 0 6px rgba(239,68,68,0.8)"></div>`, className: "", iconSize: [12, 12], iconAnchor: [6, 6] });

      L.marker([fromLat, fromLng], { icon: pickupIcon }).addTo(map);
      L.marker([toLat, toLng], { icon: destIcon }).addTo(map);
      L.polyline([[fromLat, fromLng], [toLat, toLng]], { color: "#06b6d4", weight: 3, opacity: 0.7, dashArray: "6,6" }).addTo(map);
      map.fitBounds([[fromLat, fromLng], [toLat, toLng]], { padding: [30, 30] });
      mapInstanceRef.current = map;
    });
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, [fromLat, fromLng, toLat, toLng]);

  return <div ref={mapRef} className="w-full h-48 rounded-xl overflow-hidden" />;
}

export default function PoolDetail() {
  const [, params] = useRoute("/pool/:id");
  const id = parseInt(params?.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ride, isLoading } = useGetRide(id, { query: { enabled: !!id, queryKey: getGetRideQueryKey(id) } });
  const { data: messages } = useListMessages({ rideId: id }, { query: { enabled: !!id, queryKey: getListMessagesQueryKey({ rideId: id }) } });

  const joinRide = useJoinRide();
  const sendMessage = useCreateMessage();

  const [passengerName, setPassengerName] = useState("");
  const [joinSeats, setJoinSeats] = useState(1);
  const [chatText, setChatText] = useState("");
  const [senderName, setSenderName] = useState("");
  const [joinSubmitted, setJoinSubmitted] = useState(false);

  document.title = ride ? `${ride.fromAddress} → ${ride.toAddress} — CabScan Pool` : "Ride Detail — CabScan";

  function handleJoin() {
    if (!passengerName.trim()) { toast({ title: "Enter your name", variant: "destructive" }); return; }
    joinRide.mutate(
      { id, data: { passengerName, seats: joinSeats } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(id) });
          setJoinSubmitted(true);
          toast({ title: "Request sent!", description: "The driver will review your request." });
        },
        onError: () => toast({ title: "Error", description: "Could not join ride.", variant: "destructive" }),
      }
    );
  }

  function handleSend() {
    if (!chatText.trim() || !senderName.trim()) return;
    sendMessage.mutate(
      { data: { rideId: id, senderName, text: chatText } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ rideId: id }) });
          setChatText("");
        },
      }
    );
  }

  function handleSOS() {
    alert("SOS alert sent! Emergency services have been notified. Stay calm.");
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "CabScan Pool Ride", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!" });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto text-center pt-20">
        <h2 className="text-xl font-semibold mb-4">Ride not found</h2>
        <Link href="/pool"><Button>Back to Pool</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <Link href="/pool">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="button-back-pool-detail">
            <ArrowLeft className="w-4 h-4" /> Back to Pool
          </button>
        </Link>

        {/* Ride card */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
              {ride.driverName[0]}
            </div>
            <div className="flex-1">
              <div className="font-bold text-xl">{ride.driverName}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{ride.driverRating.toFixed(1)}</span>
                <span>·</span>
                <span>{ride.driverTrips} trips</span>
                <Shield className="w-4 h-4 text-emerald-400 ml-1" />
                <span className="text-emerald-400 text-xs">Verified</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">₹{ride.farePerSeat}</div>
              <div className="text-xs text-muted-foreground">per seat</div>
            </div>
          </div>

          {/* Route */}
          <div className="space-y-2 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-primary mt-1 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Pickup</div>
                <div className="font-medium">{ride.fromAddress}</div>
              </div>
            </div>
            <div className="border-l-2 border-dashed border-border/60 ml-1.5 h-4" />
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-destructive mt-1 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Destination</div>
                <div className="font-medium">{ride.toAddress}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center border-t border-border/50 pt-4 mb-5">
            <div><div className="text-xs text-muted-foreground">Date</div><div className="font-semibold text-sm">{ride.date}</div></div>
            <div><div className="text-xs text-muted-foreground">Time</div><div className="font-semibold text-sm">{ride.time}</div></div>
            <div><div className="text-xs text-muted-foreground">Seats left</div><div className="font-semibold text-sm flex items-center justify-center gap-1"><Users className="w-3.5 h-3.5 text-primary" />{ride.seatsLeft}</div></div>
          </div>

          {ride.notes && <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-3 mb-5 italic">"{ride.notes}"</p>}

          <PoolMap fromLat={ride.fromLat} fromLng={ride.fromLng} toLat={ride.toLat} toLng={ride.toLng} />

          {/* Safety buttons */}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" className="flex-1 gap-2 border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={handleSOS} data-testid="button-sos">
              <AlertTriangle className="w-4 h-4" /> SOS
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleShare} data-testid="button-share-trip">
              <Share2 className="w-4 h-4" /> Share Trip
            </Button>
          </div>
        </div>

        {/* Join */}
        {!joinSubmitted && ride.seatsLeft > 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Request to Join</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your name</label>
                <Input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Full name" data-testid="input-passenger-name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Seats needed</label>
                <Input type="number" min={1} max={ride.seatsLeft} value={joinSeats} onChange={(e) => setJoinSeats(parseInt(e.target.value) || 1)} data-testid="input-join-seats" />
              </div>
              <Button className="w-full shadow-lg shadow-primary/20" onClick={handleJoin} disabled={joinRide.isPending} data-testid="button-join-ride">
                {joinRide.isPending ? "Sending..." : `Request to Join · ₹${ride.farePerSeat * joinSeats}`}
              </Button>
            </div>
          </div>
        ) : joinSubmitted ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <div className="text-emerald-400 font-semibold mb-1">Request sent!</div>
            <p className="text-sm text-muted-foreground">Waiting for driver approval. You'll be notified soon.</p>
          </div>
        ) : null}

        {/* Chat */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Ride Chat
          </h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {(!messages || messages.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No messages yet. Be the first to say hello!</p>
            )}
            {messages?.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3" data-testid={`message-${msg.id}`}>
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {msg.senderName[0]}
                </div>
                <div className="flex-1 bg-muted/30 rounded-xl px-3 py-2">
                  <div className="text-xs font-semibold text-primary mb-0.5">{msg.senderName}</div>
                  <div className="text-sm">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {!senderName && (
              <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name (for chat)" className="text-sm" data-testid="input-chat-name" />
            )}
            <div className="flex gap-2">
              <Input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Type a message..." className="text-sm" onKeyDown={(e) => e.key === "Enter" && handleSend()} data-testid="input-chat-message" />
              <Button size="icon" onClick={handleSend} disabled={!chatText.trim() || !senderName.trim()} data-testid="button-send-message">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
