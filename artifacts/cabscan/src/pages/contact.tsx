import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  document.title = "Contact CabScan";
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-muted-foreground">We'd love to hear from you</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5 flex items-center gap-4">
            <Mail className="w-6 h-6 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-sm">Email</div>
              <a href="mailto:info.cabscan@gmail.com" className="text-xs text-primary hover:underline">info.cabscan@gmail.com</a>
            </div>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5 flex items-center gap-4">
            <MessageSquare className="w-6 h-6 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-sm">Response time</div>
              <div className="text-xs text-muted-foreground">Within 24 hours</div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <div className="text-emerald-400 font-semibold text-lg mb-2">Message sent!</div>
            <p className="text-muted-foreground text-sm">We'll reply to {form.email} within 24 hours.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required data-testid="input-contact-name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required data-testid="input-contact-email" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={5} required data-testid="textarea-contact-message" />
              </div>
              <Button type="submit" className="w-full shadow-lg shadow-primary/20" data-testid="button-contact-submit">Send Message</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
