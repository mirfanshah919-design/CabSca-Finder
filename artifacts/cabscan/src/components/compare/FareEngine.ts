export interface Provider {
  id: string;
  name: string;
  category: string;
  region: "india" | "international" | "local";
  currency: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  surgeMin: number;
  surgeMax: number;
  isEV?: boolean;
  isNegotiable?: boolean;
  deepLink: (pLat: number, pLon: number, dLat: number, dLon: number) => string;
  fallbackUrl: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "uber_go", name: "Uber Go", category: "Economy", region: "india", currency: "₹",
    baseFare: 40, perKm: 12, perMin: 1.5, surgeMin: 1.0, surgeMax: 2.5,
    deepLink: (pLat, pLon, dLat, dLon) =>
      `uber://?action=setPickup&pickup[latitude]=${pLat}&pickup[longitude]=${pLon}&dropoff[latitude]=${dLat}&dropoff[longitude]=${dLon}`,
    fallbackUrl: "https://m.uber.com",
  },
  {
    id: "uber_premier", name: "Uber Premier", category: "Premium", region: "india", currency: "₹",
    baseFare: 80, perKm: 18, perMin: 2.0, surgeMin: 1.0, surgeMax: 2.5,
    deepLink: (pLat, pLon, dLat, dLon) =>
      `uber://?action=setPickup&pickup[latitude]=${pLat}&pickup[longitude]=${pLon}&dropoff[latitude]=${dLat}&dropoff[longitude]=${dLon}`,
    fallbackUrl: "https://m.uber.com",
  },
  {
    id: "ola_mini", name: "Ola Mini", category: "Economy", region: "india", currency: "₹",
    baseFare: 35, perKm: 10, perMin: 1.2, surgeMin: 1.0, surgeMax: 2.0,
    deepLink: (pLat, pLon, dLat, dLon) =>
      `ola://map?lat=${pLat}&lng=${pLon}&drop_lat=${dLat}&drop_lng=${dLon}`,
    fallbackUrl: "https://book.olacabs.com",
  },
  {
    id: "ola_prime", name: "Ola Prime", category: "Premium", region: "india", currency: "₹",
    baseFare: 70, perKm: 16, perMin: 1.8, surgeMin: 1.0, surgeMax: 2.0,
    deepLink: (pLat, pLon, dLat, dLon) =>
      `ola://map?lat=${pLat}&lng=${pLon}&drop_lat=${dLat}&drop_lng=${dLon}`,
    fallbackUrl: "https://book.olacabs.com",
  },
  {
    id: "rapido_bike", name: "Rapido Bike", category: "Bike", region: "india", currency: "₹",
    baseFare: 15, perKm: 4, perMin: 0.8, surgeMin: 1.0, surgeMax: 1.5,
    deepLink: () => "rapido://home",
    fallbackUrl: "https://rapido.bike",
  },
  {
    id: "rapido_auto", name: "Rapido Auto", category: "Auto", region: "india", currency: "₹",
    baseFare: 25, perKm: 7, perMin: 1.0, surgeMin: 1.0, surgeMax: 1.5,
    deepLink: () => "rapido://home",
    fallbackUrl: "https://rapido.bike",
  },
  {
    id: "blusmart", name: "BluSmart", category: "EV", region: "india", currency: "₹",
    baseFare: 50, perKm: 14, perMin: 1.5, surgeMin: 1.0, surgeMax: 1.0, isEV: true,
    deepLink: () => "blusmart://",
    fallbackUrl: "https://blu.today",
  },
  {
    id: "indrive", name: "inDrive", category: "Economy", region: "india", currency: "₹",
    baseFare: 30, perKm: 9, perMin: 1.2, surgeMin: 1.0, surgeMax: 1.0, isNegotiable: true,
    deepLink: () => "indrive://main",
    fallbackUrl: "https://indrive.com",
  },
  {
    id: "lyft", name: "Lyft", category: "Economy", region: "international", currency: "$",
    baseFare: 2.5, perKm: 1.1, perMin: 0.25, surgeMin: 1.0, surgeMax: 2.0,
    deepLink: (pLat, pLon, dLat, dLon) =>
      `lyft://ridetype?id=lyft&pickup[latitude]=${pLat}&pickup[longitude]=${pLon}&destination[latitude]=${dLat}&destination[longitude]=${dLon}`,
    fallbackUrl: "https://lyft.com",
  },
  {
    id: "bolt", name: "Bolt", category: "Economy", region: "international", currency: "$",
    baseFare: 1.5, perKm: 0.85, perMin: 0.15, surgeMin: 1.0, surgeMax: 2.0,
    deepLink: () => "taxify://main",
    fallbackUrl: "https://bolt.eu",
  },
  {
    id: "careem", name: "Careem", category: "Economy", region: "international", currency: "$",
    baseFare: 2.0, perKm: 0.95, perMin: 0.20, surgeMin: 1.0, surgeMax: 1.8,
    deepLink: () => "careem://main",
    fallbackUrl: "https://careem.com",
  },
  {
    id: "grab", name: "Grab", category: "Economy", region: "international", currency: "$",
    baseFare: 2.0, perKm: 0.90, perMin: 0.18, surgeMin: 1.0, surgeMax: 2.0,
    deepLink: () => "grab://main",
    fallbackUrl: "https://grab.com",
  },
];

export interface FareEstimate {
  provider: Provider;
  fareMin: number;
  fareMax: number;
  surge: number;
  etaMin: number;
  isAirportRoute: boolean;
  isNight: boolean;
}

function isNearAirport(lat: number, lon: number): boolean {
  const airports = [
    { lat: 28.5665, lon: 77.1031 }, // IGI Delhi
    { lat: 19.0896, lon: 72.8656 }, // Mumbai
    { lat: 12.9941, lon: 77.7063 }, // Bengaluru
    { lat: 34.0559, lon: 74.8374 }, // Srinagar
  ];
  return airports.some((a) => {
    const d = Math.sqrt((lat - a.lat) ** 2 + (lon - a.lon) ** 2);
    return d < 0.1;
  });
}

export function estimateFares(
  distanceKm: number,
  durationMin: number,
  pickupLat: number,
  pickupLon: number,
  destLat: number,
  destLon: number
): FareEstimate[] {
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;
  const nightMultiplier = isNight ? 1.25 : 1.0;
  const isAirport = isNearAirport(pickupLat, pickupLon) || isNearAirport(destLat, destLon);
  const airportSurchargeINR = isAirport ? 80 : 0;
  const airportSurchargeUSD = isAirport ? 5 : 0;
  const trafficMultiplier = 1.0 + Math.random() * 0.4;

  return PROVIDERS.map((p) => {
    const surge = p.surgeMin + Math.random() * (p.surgeMax - p.surgeMin);
    const airportAdd = p.region === "india" ? airportSurchargeINR : airportSurchargeUSD;
    const base = p.baseFare + p.perKm * distanceKm + p.perMin * durationMin;
    const fareBase = (base * trafficMultiplier + airportAdd) * nightMultiplier;
    const fareMin = Math.round(fareBase * p.surgeMin);
    const fareMax = Math.round(fareBase * surge);
    const etaMin = Math.floor(3 + Math.random() * 18);

    return { provider: p, fareMin, fareMax, surge, etaMin, isAirportRoute: isAirport, isNight };
  });
}
