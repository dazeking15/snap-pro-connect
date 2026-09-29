import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarCheck, CreditCard, Megaphone, MessageCircle, Star, XCircle } from "lucide-react";
import { PageHead } from "@/components/snap";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — SnapFind" }, { name: "description", content: "Booking, payment and message updates." },
    { property: "og:title", content: "Notifications — SnapFind" }, { property: "og:description", content: "Booking, payment and message updates." },
  ] }),
  component: () => (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHead title="Notifications" />
      <div className="space-y-2">{[
        [CalendarCheck, "Booking accepted", "Lerato Studio accepted your Signature session.", "2m"],
        [CreditCard, "Payment successful", "R3,315 paid securely.", "3m"],
        [MessageCircle, "New message", "Amara Light: Looking forward to it!", "1h"],
        [Bell, "Upcoming booking", "Your session is in 3 days.", "5h"],
        [Bell, "New booking request", "Thandi M. requested a Family session.", "1d"],
        [Star, "New review", "You received a 5-star review.", "2d"],
        [XCircle, "Booking declined", "Pixel Works is unavailable on 3 Oct.", "3d"],
        [Megaphone, "Promoted subscription activated", "Your profile now gets a visibility boost.", "5d"],
        [Megaphone, "Promoted renewal in 3 days", "R100 will be charged on 2 Oct.", "6d"],
      ].map(([I, t, d, w]: any, i) => (
        <div key={i} className="flex gap-3 rounded-2xl bg-card p-4 ring-1 ring-border animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted"><I className="h-4 w-4" /></div>
          <div className="flex-1"><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div><span className="text-xs text-muted-foreground">{w}</span>
        </div>))}</div>
    </div>
  ),
});
