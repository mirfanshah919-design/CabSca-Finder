import { Zap, Globe, Users, Shield } from "lucide-react";

export default function About() {
  document.title = "About CabScan — Smarter Rides. Better Journeys.";
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About CabScan</h1>
          <p className="text-xl text-muted-foreground">Smarter Rides. Better Journeys.</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              CabScan was built to solve a simple problem: when you need a ride, you shouldn't have to open five different apps to find the best price. We built a unified platform that compares fares across 13+ providers globally — from Uber and Ola to Bolt, Careem, and Grab — and connects you with the cheapest or fastest option in seconds.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Globe, title: "Global", desc: "13+ ride providers across India, Middle East, Southeast Asia, Europe, and North America." },
              { icon: Users, title: "Community", desc: "CabScan Pool connects commuters for shared rides — reducing costs and traffic together." },
              { icon: Shield, title: "Safe", desc: "Verified profiles, trust scores, ride sharing, and SOS features for every journey." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-card/40 p-5 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-semibold mb-2">{item.title}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              Have questions or want to partner with us? Reach us at{" "}
              <a href="mailto:info.cabscan@gmail.com" className="text-primary hover:underline">
                info.cabscan@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
