import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { getPhotographer, zar, type Photographer } from "@/lib/data";
import { PageHead } from "@/components/snap";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [
    { title: "My bookings — SnapFind" }, { name: "description", content: "Track booking status, history and reviews." },
    { property: "og:title", content: "My bookings — SnapFind" }, { property: "og:description", content: "Track booking status, history and reviews." },
  ] }),
  component: Bookings,
});

type Item = { id: string; p: Photographer; pkg: string; date: string; price: number; status: string };
const tone: Record<string, string> = { Confirmed: "bg-trust/12 text-trust", Pending: "bg-accent/20", Completed: "bg-muted", Cancelled: "bg-destructive/12 text-destructive" };

function Bookings() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewing, setReviewing] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("*").order("session_date", { ascending: false }).then(({ data }) => {
      setItems((data ?? []).flatMap((r) => { const p = getPhotographer(r.photographer_id); return p ? [{ id: r.id, p, pkg: r.package_name, date: `${new Date(r.session_date).toDateString()} · ${r.session_time}`, price: r.price, status: r.status }] : []; }));
    });
  }, [user]);
  const cancel = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "Cancelled" }).eq("id", id);
    if (error) { toast.error("Couldn't cancel"); return; }
    setItems(items.map((x) => x.id === id ? { ...x, status: "Cancelled" } : x)); toast("Booking cancelled", { description: "Refund issued per cancellation rules." });
  };
  if (!loading && !user) return <div className="py-20 text-center text-muted-foreground"><Link to="/auth" search={{ redirect: "/bookings" }} className="font-semibold text-foreground underline">Sign in</Link> to see your bookings.</div>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead title="Bookings" sub="Upcoming sessions and history" />
      {!items.length && <p className="py-10 text-center text-muted-foreground">No bookings yet. <Link to="/search" className="font-semibold text-foreground underline">Find a photographer</Link></p>}
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
