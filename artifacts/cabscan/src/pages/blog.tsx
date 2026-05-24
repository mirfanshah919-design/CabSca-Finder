import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  { slug: "1", title: "How to Get the Cheapest Ride in Delhi NCR", date: "May 20, 2026", excerpt: "We compared over 50 rides across Uber, Ola, Rapido, and inDrive to find the best-value options for daily commuters in Delhi NCR — the results might surprise you.", readTime: "4 min read", category: "Tips" },
  { slug: "2", title: "CabScan Pool: The Future of Urban Carpooling", date: "May 15, 2026", excerpt: "Carpooling is making a comeback — and CabScan Pool is leading the charge. Here's how shared rides are cutting commute costs by up to 60% for our users.", readTime: "6 min read", category: "Product" },
  { slug: "3", title: "Ride Safety 101: What Every Passenger Should Know", date: "May 10, 2026", excerpt: "From sharing trip details to using SOS features, here are the 10 habits that keep riders safe across any platform.", readTime: "5 min read", category: "Safety" },
  { slug: "4", title: "Comparing Global Ride-Hailing Apps in 2026", date: "May 5, 2026", excerpt: "Uber, Bolt, Grab, Careem, Gojek — the global ride-hailing market is fragmented. We break down who's winning where.", readTime: "8 min read", category: "Analysis" },
];

export default function Blog() {
  document.title = "Blog — CabScan";
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">CabScan Blog</h1>
          <p className="text-muted-foreground text-lg">Insights on mobility, travel, and smarter rides</p>
        </div>

        <div className="space-y-5">
          {posts.map((post) => (
            <div key={post.slug} className="group rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer" data-testid={`card-blog-${post.slug}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">{post.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                <span className="text-xs text-muted-foreground">· {post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
