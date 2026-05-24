import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Globe, Users, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetRideStats } from "@workspace/api-client-react";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/60 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

const STEPS = [
  { num: "01", title: "Enter your route", desc: "Type any address, landmark, or place worldwide." },
  { num: "02", title: "Compare all providers", desc: "See real-time fare estimates from Uber, Ola, Rapido, Lyft, and 10+ others." },
  { num: "03", title: "Open the app instantly", desc: "Tap to launch the provider app with your route prefilled." },
];

export default function Home() {
  document.title = "CabScan — Smarter Rides. Better Journeys.";
  const { data: stats } = useGetRideStats();

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8 font-medium">
            <Zap className="w-3.5 h-3.5" />
            Compare 13+ ride providers globally
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Smarter Rides.
            <br />
            <span className="text-primary">Better Journeys.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Compare fares from Uber, Ola, Rapido, Lyft, Bolt, Careem and more — then open the cheapest app in one tap. Plus, share rides with CabScan Pool.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/compare">
              <Button size="lg" className="gap-2 text-base px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" data-testid="button-compare-hero">
                Compare Rides <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pool">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8" data-testid="button-pool-hero">
                <Users className="w-4 h-4" /> Join a Pool Ride
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 py-10 border-t border-border/50">
            <StatCard label="Total Rides" value={stats ? `${stats.totalRides}+` : "1,200+"} />
            <StatCard label="Active Rides" value={stats ? stats.activeRides : "48"} />
            <StatCard label="Cities Served" value={stats ? stats.citiesServed : "12"} />
            <StatCard label="Avg Driver Rating" value={stats ? stats.avgRating.toFixed(1) : "4.8"} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CabScan Works</h2>
            <p className="text-muted-foreground text-lg">Three steps to your best ride</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{s.num}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg">Built for modern global travel</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Globe} title="Global Coverage" desc="13+ providers across India, Middle East, Southeast Asia, Europe and North America." />
            <FeatureCard icon={Zap} title="Instant Deep Links" desc="Open any provider app with your route pre-filled. No re-typing addresses." />
            <FeatureCard icon={MapPin} title="Smart Location Search" desc="Fuzzy search for buildings, landmarks, metro stations, and exact addresses worldwide." />
            <FeatureCard icon={Users} title="CabScan Pool" desc="Post or join carpooling rides. Save money, reduce traffic, meet travel companions." />
            <FeatureCard icon={Shield} title="Safety First" desc="Verified driver profiles, trust scores, ratings, and emergency SOS features." />
            <FeatureCard icon={Star} title="Real Fare Estimates" desc="Dynamic pricing engine with surge, traffic, airport, and night rate adjustments." />
          </div>
        </div>
      </section>

      {/* Pool CTA */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 -z-10" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-xs text-primary mb-6 font-medium">
              <Users className="w-3 h-3" /> CabScan Pool
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Share the ride. Split the cost.</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              CabScan Pool connects drivers and passengers on similar routes — inspired by BlaBlaCar, built for your city.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pool/offer">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20" data-testid="button-offer-cta">
                  <Clock className="w-4 h-4" /> Offer a Ride
                </Button>
              </Link>
              <Link href="/pool/find">
                <Button variant="outline" size="lg" className="gap-2" data-testid="button-find-cta">
                  Find a Ride <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
