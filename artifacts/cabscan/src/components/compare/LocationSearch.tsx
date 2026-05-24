import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, X, Clock } from "lucide-react";

export interface LocationResult {
  display_name: string;
  lat: number;
  lon: number;
  formatted?: string;
}

interface LocationSearchProps {
  placeholder: string;
  value: LocationResult | null;
  onChange: (result: LocationResult | null) => void;
  icon?: "pickup" | "destination";
  "data-testid"?: string;
}

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY as string | undefined;
const RECENT_KEY = "cabscan_recent_searches";
const MAX_RECENT = 5;

function getRecent(): LocationResult[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecent(item: LocationResult) {
  const recent = getRecent().filter((r) => r.display_name !== item.display_name);
  recent.unshift(item);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

async function searchGeoapify(query: string): Promise<LocationResult[]> {
  if (!GEOAPIFY_KEY) return [];
  try {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}&limit=5&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: { formatted: string; lat: number; lon: number }) => ({
      display_name: r.formatted,
      lat: r.lat,
      lon: r.lon,
      formatted: r.formatted,
    }));
  } catch {
    return [];
  }
}

async function searchNominatim(query: string): Promise<LocationResult[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: { display_name: string; lat: string; lon: string }) => ({
      display_name: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
    }));
  } catch {
    return [];
  }
}

const cache = new Map<string, LocationResult[]>();

export function LocationSearch({ placeholder, value, onChange, icon = "pickup", "data-testid": testId }: LocationSearchProps) {
  const [query, setQuery] = useState(value?.display_name || "");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recent] = useState<LocationResult[]>(getRecent);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value?.display_name || "");
  }, [value]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    if (cache.has(q)) { setResults(cache.get(q)!); return; }
    setLoading(true);
    let r = await searchGeoapify(q);
    if (r.length === 0) r = await searchNominatim(q);
    cache.set(q, r);
    setResults(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query === value?.display_name) { setResults([]); return; }
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search, value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(r: LocationResult) {
    onChange(r);
    setQuery(r.display_name);
    setResults([]);
    setOpen(false);
    saveRecent(r);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    const list = results.length > 0 ? results : open ? recent : [];
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, list.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0 && list[activeIdx]) { select(list[activeIdx]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  const showDropdown = open && (results.length > 0 || (query.length === 0 && recent.length > 0) || loading);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <div className={`absolute left-3 w-2.5 h-2.5 rounded-full ${icon === "pickup" ? "bg-primary" : "bg-destructive"}`} />
        <input
          ref={inputRef}
          data-testid={testId}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="w-full pl-8 pr-10 py-3 bg-background/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
          autoComplete="off"
        />
        <div className="absolute right-3 flex items-center gap-1">
          {loading && <Search className="w-4 h-4 text-muted-foreground animate-pulse" />}
          {value && !loading && (
            <button onClick={clear} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <Search className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          )}
          {!loading && results.length === 0 && query.length === 0 && recent.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Recent
              </div>
              {recent.map((r, i) => (
                <button
                  key={i}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-accent transition-colors flex items-start gap-3 ${activeIdx === i ? "bg-accent" : ""}`}
                  onClick={() => select(r)}
                >
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="truncate">{r.display_name}</span>
                </button>
              ))}
            </>
          )}
          {!loading && results.map((r, i) => (
            <button
              key={i}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-accent transition-colors flex items-start gap-3 ${activeIdx === i ? "bg-accent" : ""}`}
              onClick={() => select(r)}
            >
              <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${icon === "pickup" ? "text-primary" : "text-destructive"}`} />
              <span className="line-clamp-2">{r.display_name}</span>
            </button>
          ))}
          {!loading && query.length > 1 && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
