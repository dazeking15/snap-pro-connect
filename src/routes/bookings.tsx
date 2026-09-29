import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { PHOTOGRAPHERS, zar } from "@/lib/data";
import { PageHead } from "@/components/snap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [
    { title: "My bookings — SnapFind" }, { name: "description", content: "Track booking status, history and reviews." },
    { property: "og:title", content: "My bookings — SnapFind" }, { property: "og:description", content: "Track booking status, history and reviews." },
  ] }),
  component: Bookings,
});

const initial = [
  { id: "b1", p: PHOTOGRAPHERS[0], pkg: "Signature", date: "Sat, 10 Oct 2026", price: 3300, status: "Confirmed" },
  { id: "b2", p: PHOTOGRAPHERS[2], pkg: "Essential", date: "Wed, 21 Oct 2026", price: 1200, status: "Pending" },
  { id: "b3", p: PHOTOGRAPHERS[4], pkg: "Essential", date: "Sun, 16 Aug 2026", price: 800, status: "Completed" },
];
const tone: Record<string, string> = { Confirmed: "bg-trust/12 text-trust", Pending: "bg-accent/20", Completed: "bg-muted", Cancelled: "bg-destructive/12 text-destructive" };

function Bookings() {
  const [items, setItems] = useState(initial);
  const [rating, setRating] = useState(0);
  const [reviewing, setReviewing] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead title="Bookings" sub="Upcoming sessions and history" />
      <div className="space-y-3">{items.map((b) => (
        <div key={b.id} className="rounded-3xl bg-card p-4 ring-1 ring-border">
          <div className="flex gap-4">
            <img src={b.p.portfolio[0]} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="flex items-start justify-between"><Link to="/p/$id" params={{ id: b.p.id }} className="font-display text-lg">{b.p.business}</Link><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", tone[b.status])}>{b.status}</span></div>
              <p className="text-sm text-muted-foreground">{b.pkg} · {b.date}</p>
              <p className="text-sm">Paid {zar(b.price + 15)} <span className="text-muted-foreground">(incl. R15 fee)</span></p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link to="/messages" className="rounded-full px-3 py-1.5 ring-1 ring-border">Message</Link>
            {(b.status === "Confirmed" || b.status === "Pending") && <button onClick={() => { setItems(items.map((x) => x.id === b.id ? { ...x, status: "Cancelled" } : x)); toast("Booking cancelled", { description: "Refund issued per cancellation rules." }); }} className="rounded-full px-3 py-1.5 text-destructive ring-1 ring-border">Cancel</button>}
            {b.status === "Completed" && <button onClick={() => setReviewing(b.id)} className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">Leave review</button>}
            {b.status === "Completed" && <button onClick={() => toast("Dispute opened", { description: "Our team will respond within 24h." })} className="rounded-full px-3 py-1.5 ring-1 ring-border">Dispute</button>}
          </div>
          {reviewing === b.id && <div className="mt-3 space-y-2 rounded-2xl bg-muted/60 p-3 animate-in fade-in">
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)}><Star className={cn("h-7 w-7", n <= rating ? "fill-accent text-accent" : "text-muted-foreground")} /></button>)}</div>
            <textarea placeholder="How was your session?" className="w-full rounded-xl bg-background p-3 text-sm outline-none" />
            <input type="file" multiple accept="image/*" className="text-xs" />
            <button onClick={() => { setReviewing(null); toast.success("Thanks for your review!"); }} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Submit</button>
          </div>}
        </div>))}</div>
    </div>
  );
}
