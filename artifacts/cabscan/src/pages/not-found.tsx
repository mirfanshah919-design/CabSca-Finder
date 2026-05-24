import { Link } from "wouter";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  document.title = "Page Not Found — CabScan";
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" /> Go Home
            </Button>
          </Link>
          <Link href="/compare">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" /> Compare Rides
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
