import { useGetRideStats, useGetRecentActivity, useListRides, useListProfiles, useDeleteRide, getListRidesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, MapPin, Star, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export default function Admin() {
  document.title = "Admin Dashboard — CabScan";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useGetRideStats();
  const { data: activity } = useGetRecentActivity();
  const { data: rides, isLoading: ridesLoading } = useListRides();
  const { data: profiles } = useListProfiles();
  const deleteRide = useDeleteRide();

  function handleDelete(id: number) {
    if (!confirm("Delete this ride?")) return;
    deleteRide.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
          toast({ title: "Ride deleted" });
        },
        onError: () => toast({ title: "Error deleting ride", variant: "destructive" }),
      }
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">CabScan platform overview</p>
          </div>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Rides" value={stats?.totalRides ?? 0} icon={Zap} />
            <StatCard label="Active Rides" value={stats?.activeRides ?? 0} icon={MapPin} />
            <StatCard label="Passengers" value={stats?.totalPassengers ?? 0} icon={Users} />
            <StatCard label="Avg Rating" value={stats?.avgRating?.toFixed(1) ?? "—"} icon={Star} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Top Routes Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5">
            <h2 className="font-semibold mb-4">Top Routes</h2>
            {stats?.topRoutes && stats.topRoutes.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.topRoutes.map((r) => ({ name: `${r.from.split(",")[0]} → ${r.to.split(",")[0]}`, count: r.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No route data yet</div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-52 overflow-y-auto">
              {(!activity || activity.length === 0) && <p className="text-sm text-muted-foreground">No activity yet</p>}
              {activity?.map((item) => (
                <div key={item.id} className="flex items-start gap-2" data-testid={`activity-${item.id}`}>
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    {item.avatar ? item.avatar[0] : "?"}
                  </div>
                  <div>
                    <p className="text-xs text-foreground leading-snug">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rides Table */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 mb-6">
          <h2 className="font-semibold mb-4">All Rides</h2>
          {ridesLoading ? <Skeleton className="h-40 rounded-xl" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Driver</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Route</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Seats</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!rides || rides.length === 0) && (
                    <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No rides yet</td></tr>
                  )}
                  {rides?.map((ride) => (
                    <tr key={ride.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors" data-testid={`admin-ride-row-${ride.id}`}>
                      <td className="py-3 px-3 font-medium">{ride.driverName}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs max-w-[200px]">
                        <div className="truncate">{ride.fromAddress}</div>
                        <div className="truncate">→ {ride.toAddress}</div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{ride.date}</td>
                      <td className="py-3 px-3">{ride.seatsLeft}/{ride.seats}</td>
                      <td className="py-3 px-3">
                        <Badge variant={ride.status === "active" ? "default" : "secondary"} className="text-xs">
                          {ride.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(ride.id)} data-testid={`button-delete-ride-${ride.id}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profiles Table */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5">
          <h2 className="font-semibold mb-4">User Profiles</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Rating</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Verified</th>
                </tr>
              </thead>
              <tbody>
                {(!profiles || profiles.length === 0) && (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No profiles yet</td></tr>
                )}
                {profiles?.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20" data-testid={`admin-profile-row-${p.id}`}>
                    <td className="py-3 px-3 font-medium">{p.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{p.email ?? "—"}</td>
                    <td className="py-3 px-3 flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{(p.rating ?? 0).toFixed(1)}</td>
                    <td className="py-3 px-3">{p.verified ? <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Verified</Badge> : <Badge variant="secondary" className="text-xs">Unverified</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
