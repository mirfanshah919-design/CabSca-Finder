export default function Privacy() {
  document.title = "Privacy Policy — CabScan";
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 2026</p>

        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 not-prose space-y-6 mt-8">
          {[
            { title: "Information We Collect", body: "We collect information you provide directly to us, including your name, email address, phone number, and location data when you use our ride comparison or pool features. We also collect usage data automatically, such as the routes you search and the providers you compare." },
            { title: "How We Use Your Information", body: "We use your information to operate and improve CabScan, to match you with pool rides, to send you ride updates and notifications, and to ensure platform safety. We do not sell your personal data to third parties." },
            { title: "Location Data", body: "CabScan uses your location to show nearby rides, calculate fares, and enable live tracking on pool rides. You can control location permissions through your device settings. Denying location access will limit some features." },
            { title: "Data Sharing", body: "We share your information with ride providers only when you choose to open their app through CabScan. Pool ride drivers receive your name and requested seats when you join a ride. We use trusted third-party services for maps (OpenStreetMap) and location search (Geoapify)." },
            { title: "Data Retention", body: "We retain your account data for as long as your account is active. Ride history is retained for 12 months. You can request deletion of your data by emailing info.cabscan@gmail.com." },
            { title: "Contact", body: "For privacy-related inquiries, contact us at info.cabscan@gmail.com." },
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
