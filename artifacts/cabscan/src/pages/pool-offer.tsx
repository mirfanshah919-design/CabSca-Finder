import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRide, getListRidesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  driverName: z.string().min(2, "Name required"),
  fromAddress: z.string().min(3, "Pickup required"),
  toAddress: z.string().min(3, "Destination required"),
  date: z.string().min(1, "Date required"),
  time: z.string().min(1, "Time required"),
  seats: z.coerce.number().min(1).max(6),
  farePerSeat: z.coerce.number().min(1, "Fare required"),
  luggageAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  musicAllowed: z.boolean(),
  genderPreference: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PoolOffer() {
  document.title = "Offer a Ride — CabScan Pool";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createRide = useCreateRide();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      driverName: "",
      fromAddress: "",
      toAddress: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      seats: 2,
      farePerSeat: 150,
      luggageAllowed: true,
      smokingAllowed: false,
      musicAllowed: true,
      genderPreference: "any",
      notes: "",
    },
  });

  function onSubmit(values: FormValues) {
    createRide.mutate(
      {
        data: {
          ...values,
          fromLat: 28.6139,
          fromLng: 77.2090,
          toLat: 28.4595,
          toLng: 77.0266,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
          toast({ title: "Ride posted!", description: "Your ride is now live." });
          setLocation("/pool");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to post ride. Try again.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/pool">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="button-back-pool">
            <ArrowLeft className="w-4 h-4" /> Back to Pool
          </button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Offer a Ride</h1>
        <p className="text-muted-foreground mb-8">Post your route and let passengers join you</p>

        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl><Input placeholder="Full name" {...field} data-testid="input-driver-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField control={form.control} name="fromAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl><Input placeholder="Pickup city/area" {...field} data-testid="input-from" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="toAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl><Input placeholder="Destination city/area" {...field} data-testid="input-to" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl><Input type="date" {...field} data-testid="input-date" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="time" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl><Input type="time" {...field} data-testid="input-time" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField control={form.control} name="seats" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seats available</FormLabel>
                    <FormControl><Input type="number" min={1} max={6} {...field} data-testid="input-seats" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="farePerSeat" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fare per seat (₹)</FormLabel>
                    <FormControl><Input type="number" min={1} {...field} data-testid="input-fare" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="genderPreference" render={({ field }) => (
                <FormItem>
                  <FormLabel>Passenger preference</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger data-testid="select-gender"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male">Male only</SelectItem>
                      <SelectItem value="female">Female only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Preferences */}
              <div className="space-y-3 pt-2">
                <div className="text-sm font-medium text-foreground">Preferences</div>
                {[
                  { name: "luggageAllowed" as const, label: "Luggage allowed" },
                  { name: "musicAllowed" as const, label: "Music OK" },
                  { name: "smokingAllowed" as const, label: "Smoking allowed" },
                ].map((pref) => (
                  <FormField key={pref.name} control={form.control} name={pref.name} render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-4 py-3">
                      <FormLabel className="cursor-pointer mb-0">{pref.label}</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid={`switch-${pref.name}`} />
                      </FormControl>
                    </FormItem>
                  )} />
                ))}
              </div>

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl><Textarea placeholder="Any additional info for passengers..." rows={3} {...field} data-testid="textarea-notes" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/20" disabled={createRide.isPending} data-testid="button-submit-ride">
                {createRide.isPending ? "Posting..." : "Post Ride"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
