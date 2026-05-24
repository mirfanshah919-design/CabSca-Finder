import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { LocationResult } from "./LocationSearch";

interface RideMapProps {
  pickup: LocationResult | null;
  destination: LocationResult | null;
  onRouteCalculated?: (distanceKm: number, durationMin: number) => void;
}

export function RideMap({ pickup, destination, onRouteCalculated }: RideMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const layersRef = useRef<import("leaflet").Layer[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [28.6139, 77.2090],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing layers
    layersRef.current.forEach((l) => map.removeLayer(l));
    layersRef.current = [];

    import("leaflet").then(async (L) => {
      if (pickup) {
        const pickupIcon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#06b6d4;border:3px solid white;box-shadow:0 0 8px rgba(6,182,212,0.8)"></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const m = L.marker([pickup.lat, pickup.lon], { icon: pickupIcon })
          .addTo(map)
          .bindPopup(`<b>Pickup:</b> ${pickup.display_name}`);
        layersRef.current.push(m);
      }

      if (destination) {
        const destIcon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 8px rgba(239,68,68,0.8)"></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const m = L.marker([destination.lat, destination.lon], { icon: destIcon })
          .addTo(map)
          .bindPopup(`<b>Destination:</b> ${destination.display_name}`);
        layersRef.current.push(m);
      }

      if (pickup && destination) {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lon},${pickup.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            const route = data.routes?.[0];
            if (route) {
              const coords: [number, number][] = route.geometry.coordinates.map(
                ([lon, lat]: [number, number]) => [lat, lon]
              );
              const poly = L.polyline(coords, {
                color: "#06b6d4",
                weight: 4,
                opacity: 0.8,
                dashArray: undefined,
              }).addTo(map);
              layersRef.current.push(poly);
              map.fitBounds(poly.getBounds(), { padding: [40, 40] });

              if (onRouteCalculated) {
                const distKm = route.distance / 1000;
                const durMin = route.duration / 60;
                onRouteCalculated(distKm, durMin);
              }
              return;
            }
          }
        } catch {
          // fallback: just fit markers
        }

        const bounds = L.latLngBounds(
          [pickup.lat, pickup.lon],
          [destination.lat, destination.lon]
        );
        map.fitBounds(bounds, { padding: [40, 40] });

        const distKm = map.distance([pickup.lat, pickup.lon], [destination.lat, destination.lon]) / 1000;
        if (onRouteCalculated) onRouteCalculated(distKm, distKm / 30 * 60);
      } else if (pickup) {
        map.setView([pickup.lat, pickup.lon], 14);
      } else if (destination) {
        map.setView([destination.lat, destination.lon], 14);
      }
    });
  }, [pickup, destination, onRouteCalculated]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: 320 }}
      data-testid="map-container"
    />
  );
}
