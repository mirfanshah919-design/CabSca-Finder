import { ExternalLink, Clock, MapPin, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ProviderTier, openProvider, type DeepLinkParams } from "./ProviderTiers";

interface ProviderCardProps {
  provider: ProviderTier;
  distanceKm: number;
  durationMin: number;
  index: number;
  params: DeepLinkParams;
}

const BADGE_STYLES: Record<string, string> = {
  green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  gold: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  teal: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  CHEAPEST: <span>🏆</span>,
  PREMIUM: <span>✨</span>,
  EV: <Leaf className="w-2.5 h-2.5" />,
  NEGOTIATE: <span>💬</span>,
};

export function ProviderCard({ provider, distanceKm, durationMin, index, params }: ProviderCardProps) {
  function handleOpen() {
    openProvider(provider, params);
  }

  const providerInitials = provider.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
      data-testid={`card-provider-${provider.id}`}
    >
      {/* Badge */}
      {provider.badge && provider.badgeColor && (
        <div className="absolute -top-2.5 right-4">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BADGE_STYLES[provider.badgeColor]}`}>
            {BADGE_ICONS[provider.badge]}
            {provider.badge}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Logo placeholder */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover:bg-primary/20 transition-colors">
          {providerInitials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-0.5">{provider.name}</div>
          <div className="text-xs text-muted-foreground">{provider.category}</div>
        </div>
      </div>

      {/* Route info */}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-medium text-foreground">{durationMin} min</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-medium text-foreground">{distanceKm} km</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span>ETA {provider.eta}</span>
        </div>
      </div>

      <Button
        className="w-full mt-3 gap-2"
        size="sm"
        onClick={handleOpen}
        data-testid={`button-open-app-${provider.id}`}
      >
        Open {provider.name.split(" ")[0]}
        <ExternalLink className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
