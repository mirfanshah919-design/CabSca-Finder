export interface ProviderTier {
  id: string;
  name: string;
  category: string;
  tier: number;
  badge: string | null;
  badgeColor: "green" | "gold" | "teal" | "blue" | "purple" | null;
  eta: string;
  regions: string[];
  appLinks: {
    app: (pLat: number, pLng: number, dLat: number, dLng: number) => string;
    web: string;
  };
}

export const PROVIDER_TIERS: ProviderTier[] = [
  {
    id: "rapido_bike",
    name: "Rapido Bike",
    category: "Bike",
    tier: 1,
    badge: "CHEAPEST",
    badgeColor: "green",
    eta: "3–6 min",
    regions: ["india"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `rapido://book?slat=${pLat}&slng=${pLng}&dlat=${dLat}&dlng=${dLng}&type=bike`,
      web: "https://rapido.bike/",
    },
  },
  {
    id: "rapido_auto",
    name: "Rapido Auto",
    category: "Auto",
    tier: 2,
    badge: null,
    badgeColor: null,
    eta: "5–8 min",
    regions: ["india"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `rapido://book?slat=${pLat}&slng=${pLng}&dlat=${dLat}&dlng=${dLng}&type=auto`,
      web: "https://rapido.bike/",
    },
  },
  {
    id: "ola_mini",
    name: "Ola Mini",
    category: "Mini · Car",
    tier: 3,
    badge: null,
    badgeColor: null,
    eta: "5–10 min",
    regions: ["india"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `ola://booking?pickup_lat=${pLat}&pickup_lng=${pLng}&drop_lat=${dLat}&drop_lng=${dLng}&category=mini`,
      web: `https://book.olacabs.com/`,
    },
  },
  {
    id: "indrive",
    name: "inDrive",
    category: "Sedan · Negotiable",
    tier: 3,
    badge: "NEGOTIATE",
    badgeColor: "blue",
    eta: "7–12 min",
    regions: ["india", "international"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `indrive://order?from_lat=${pLat}&from_lng=${pLng}&to_lat=${dLat}&to_lng=${dLng}`,
      web: "https://indrive.com/",
    },
  },
  {
    id: "blusmart",
    name: "BluSmart",
    category: "EV · Car",
    tier: 3,
    badge: "EV",
    badgeColor: "teal",
    eta: "8–15 min",
    regions: ["india"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `blusmart://book?pickup_lat=${pLat}&pickup_lng=${pLng}&drop_lat=${dLat}&drop_lng=${dLng}`,
      web: "https://www.blusmart.in/",
    },
  },
  {
    id: "uber_go",
    name: "Uber Go",
    category: "Economy · Car",
    tier: 4,
    badge: null,
    badgeColor: null,
    eta: "4–8 min",
    regions: ["india", "international"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `uber://?action=setPickup&pickup[latitude]=${pLat}&pickup[longitude]=${pLng}&dropoff[latitude]=${dLat}&dropoff[longitude]=${dLng}`,
      web: `https://m.uber.com/ul/?action=setPickup`,
    },
  },
  {
    id: "ola_prime",
    name: "Ola Prime",
    category: "Sedan · Car",
    tier: 5,
    badge: null,
    badgeColor: null,
    eta: "6–12 min",
    regions: ["india"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `ola://booking?pickup_lat=${pLat}&pickup_lng=${pLng}&drop_lat=${dLat}&drop_lng=${dLng}&category=prime`,
      web: "https://book.olacabs.com/",
    },
  },
  {
    id: "uber_premier",
    name: "Uber Premier",
    category: "Premium · Car",
    tier: 6,
    badge: "PREMIUM",
    badgeColor: "gold",
    eta: "8–15 min",
    regions: ["india", "international"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `uber://?action=setPickup&pickup[latitude]=${pLat}&pickup[longitude]=${pLng}&dropoff[latitude]=${dLat}&dropoff[longitude]=${dLng}&product_id=premier`,
      web: "https://m.uber.com/ul/?action=setPickup",
    },
  },
  {
    id: "bolt",
    name: "Bolt",
    category: "Economy · Car",
    tier: 3,
    badge: "CHEAPEST",
    badgeColor: "green",
    eta: "5–10 min",
    regions: ["international"],
    appLinks: {
      app: () => `bolt://`,
      web: "https://bolt.eu/",
    },
  },
  {
    id: "lyft",
    name: "Lyft",
    category: "Economy · Car",
    tier: 4,
    badge: null,
    badgeColor: null,
    eta: "5–10 min",
    regions: ["us"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `lyft://ridetype?id=lyft&pickup[latitude]=${pLat}&pickup[longitude]=${pLng}&destination[latitude]=${dLat}&destination[longitude]=${dLng}`,
      web: "https://www.lyft.com/ride",
    },
  },
  {
    id: "grab",
    name: "Grab",
    category: "Economy · Car",
    tier: 3,
    badge: null,
    badgeColor: null,
    eta: "5–12 min",
    regions: ["southeast_asia"],
    appLinks: {
      app: (pLat, pLng, dLat, dLng) =>
        `grab://open?screenType=BOOKING&sourceLocation=${pLat},${pLng}&destinationLocation=${dLat},${dLng}`,
      web: "https://www.grab.com/",
    },
  },
  {
    id: "gojek",
    name: "Gojek",
    category: "Bike / Car",
    tier: 2,
    badge: "CHEAPEST",
    badgeColor: "green",
    eta: "3–8 min",
    regions: ["southeast_asia"],
    appLinks: {
      app: () => `gojek://`,
      web: "https://www.gojek.com/",
    },
  },
  {
    id: "careem",
    name: "Careem",
    category: "Economy · Car",
    tier: 3,
    badge: null,
    badgeColor: null,
    eta: "6–12 min",
    regions: ["middle_east"],
    appLinks: {
      app: () => `careem://`,
      web: "https://www.careem.com/",
    },
  },
  {
    id: "didi",
    name: "DiDi",
    category: "Economy · Car",
    tier: 3,
    badge: null,
    badgeColor: null,
    eta: "5–10 min",
    regions: ["china", "latam", "australia"],
    appLinks: {
      app: () => `DiDi://`,
      web: "https://www.didiglobal.com/",
    },
  },
  {
    id: "yandex_go",
    name: "Yandex Go",
    category: "Economy · Car",
    tier: 3,
    badge: null,
    badgeColor: null,
    eta: "4–8 min",
    regions: ["russia", "cis"],
    appLinks: {
      app: () => `yandexmaps://`,
      web: "https://go.yandex/",
    },
  },
];

export interface DeepLinkParams {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
}

export function openProvider(provider: ProviderTier, params: DeepLinkParams) {
  const { pickupLat, pickupLng, dropLat, dropLng } = params;
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  if (isMobile) {
    const appUrl = provider.appLinks.app(pickupLat, pickupLng, dropLat, dropLng);
    const start = Date.now();
    window.location.href = appUrl;
    setTimeout(() => {
      if (Date.now() - start < 2500) {
        window.open(provider.appLinks.web, "_blank", "noopener,noreferrer");
      }
    }, 2000);
  } else {
    window.open(provider.appLinks.web, "_blank", "noopener,noreferrer");
  }
}

export function openAllApps(providers: ProviderTier[], params: DeepLinkParams) {
  const top3 = providers.slice(0, 3);
  top3.forEach((provider, index) => {
    setTimeout(() => {
      window.open(provider.appLinks.web, "_blank", "noopener,noreferrer");
    }, index * 300);
  });
}

export async function getRouteData(
  pickupLat: number,
  pickupLng: number,
  dropLat: number,
  dropLng: number
): Promise<{ distanceKm: number; durationMin: number }> {
  const key = (import.meta.env.VITE_OPENROUTE_API_KEY as string | undefined) ?? "";

  if (key) {
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${key}&start=${pickupLng},${pickupLat}&end=${dropLng},${dropLat}`
      );
      if (res.ok) {
        const data = await res.json();
        const segment = data.features?.[0]?.properties?.segments?.[0];
        if (segment) {
          return {
            distanceKm: Math.round((segment.distance / 1000) * 10) / 10,
            durationMin: Math.round(segment.duration / 60),
          };
        }
      }
    } catch {
      // fall through to Haversine
    }
  }

  // Haversine fallback (with ~30% road factor)
  const R = 6371;
  const dLat = ((dropLat - pickupLat) * Math.PI) / 180;
  const dLng = ((dropLng - pickupLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((pickupLat * Math.PI) / 180) *
      Math.cos((dropLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.3 * 10) / 10;
  const durationMin = Math.round((distanceKm / 25) * 60);
  return { distanceKm, durationMin };
}
