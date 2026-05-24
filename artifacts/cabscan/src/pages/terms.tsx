export default function Terms() {
  document.title = "Terms of Service — CabScan";
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: May 2026</p>

        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-6">
          {[
            { title: "1. Acceptance of Terms", body: "By using CabScan, you agree to these Terms of Service. If you do not agree, please do not use the platform." },
            { title: "2. Use of Service", body: "CabScan provides fare comparison tools and pool ride coordination. We are not a transportation provider. Rides are fulfilled by third-party providers. CabScan Pool connects drivers and passengers directly — CabScan is not a party to those arrangements." },
            { title: "3. Fare Estimates", body: "Fare estimates on CabScan are indicative only. Actual fares are determined by the ride provider and may differ due to surge pricing, traffic, tolls, or other factors." },
            { title: "4. Pool Rides", body: "Pool rides are coordinated between private individuals. CabScan does not screen drivers or guarantee ride quality. Users are responsible for verifying ride details before confirming a booking." },
            { title: "5. User Conduct", body: "You agree not to misuse the platform, post false information, harass other users, or use CabScan for any unlawful purpose. Violations may result in account termination." },
            { title: "6. Limitation of Liability", body: "CabScan is provided 'as is'. We are not liable for any damages arising from your use of the platform, including but not limited to ride cancellations, fare discrepancies, or incidents during pool rides." },
            { title: "7. Contact", body: "For legal inquiries, contact info.cabscan@gmail.com." },
          ].map((s) => (
            <div key={s.title}>
              <h3 className="font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
