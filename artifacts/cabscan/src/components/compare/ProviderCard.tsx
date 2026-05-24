import { ExternalLink, Leaf, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FareEstimate } from "./FareEngine";

interface ProviderCardProps {
  estimate: FareEstimate;
  isCheapest: boolean;
  isFastest: boolean;
  pickupLat: number;
  pickupLon: number;
  destLat: number;
  destLon: number;
}

export function ProviderCard({ estimate, isCheapest, isFastest, pickupLat, pickupLon, destLat, destLon }: ProviderCardProps) {
  const { provider: p, fareMin, fareMax, surge, etaMin } = estimate;

  function openApp() {
    const deepLink = p.deepLink(pickupLat, pickupLon, destLat, destLon);
    window.location.href = deepLink;
    setTimeout(() => {
      window.open(p.fallbackUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  }

  return (
    <div
      className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      data-testid={`card-provider-${p.id}`}
    >
      {/* Badges row */}
      <div className="flex flex-wrap gap-1 mb-3 min-h-[20px]">
        {isCheapest && <Badge className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Cheapest</Badge>}
        {isFastest && <Badge className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 border-blue-500/30">Fastest</Badge>}
        {p.isEV && <Badge className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1"><Leaf className="w-2.5 h-2.5" />EV</Badge>}
        {surge > 1.3 && <Badge className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 border-orange-500/30">{surge.toFixed(1)}x Surge</Badge>}
        {p.isNegotiable && <Badge className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 border-purple-500/30">Negotiable</Badge>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Provider name */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {p.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.category}</div>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="font-bold text-lg text-foreground">
            {p.currency}{fareMin}–{p.currency}{fareMax}
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {etaMin} min away
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-3 gap-2"
        size="sm"
        onClick={openApp}
        data-testid={`button-open-app-${p.id}`}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open {p.name.split(" ")[0]}
      </Button>

      <p className="text-[10px] text-muted-foreground text-center mt-2">
        Estimated fare — actual prices may vary
      </p>
    </div>
  );
}
