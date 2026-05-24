import { Link } from "wouter";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { href: "/compare", label: "Compare Rides" },
    { href: "/pool", label: "CabScan Pool" },
    { href: "/pool/offer", label: "Offer a Ride" },
    { href: "/pool/find", label: "Find a Ride" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/safety", label: "Safety" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">CabScan</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Smarter Rides. Better Journeys.
            </p>
            <a
              href="mailto:info.cabscan@gmail.com"
              className="text-sm text-primary hover:underline"
            >
              info.cabscan@gmail.com
            </a>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm mb-4 text-foreground">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CabScan. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Global mobility-tech platform
          </p>
        </div>
      </div>
    </footer>
  );
}
