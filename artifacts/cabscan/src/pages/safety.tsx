import { Shield, AlertTriangle, Phone, Share2, Star, Eye } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Profiles", desc: "All pool ride drivers go through email and phone verification. Look for the verified badge before joining a ride." },
  { icon: Star, title: "Ratings & Reviews", desc: "Rate your driver and passenger after every pool ride. Trust scores are built from consistent ride history and reviews." },
  { icon: AlertTriangle, title: "SOS Button", desc: "In any pool ride, tap the SOS button to instantly alert emergency contacts and send your live location to authorities." },
  { icon: Share2, title: "Share Your Trip", desc: "Use the Share Trip button to send your live route and ETA to friends or family before a pool ride begins." },
  { icon: Phone, title: "Emergency Contacts", desc: "Add emergency contacts in your profile. They'll be notified automatically if you trigger an SOS alert." },
  { icon: Eye, title: "Report & Block", desc: "See something wrong? Report any user or ride through the platform. Reported accounts are reviewed within 24 hours." },
];

export default function Safety() {
  document.title = "Safety — CabScan";
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Your Safety, Our Priority</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            CabScan is built with safety at its core — from verified profiles to real-time SOS features.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Need immediate help?</h3>
          <p className="text-sm text-muted-foreground mb-3">Contact our safety team directly</p>
          <a href="mailto:info.cabscan@gmail.com" className="text-primary hover:underline font-medium">
            info.cabscan@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
