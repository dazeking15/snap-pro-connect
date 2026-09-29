import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PHOTOGRAPHERS, zar, PROMOTED_PRICE } from "@/lib/data";
import { PhotographerCard, Stat } from "@/components/snap";

export const Route = createFileRoute("/promoted")({
  head: () => ({ meta: [
    { title: "Get more visibility — Promoted | SnapFind" }, { name: "description", content: "Promote your photographer profile for R100/month." },
    { property: "og:title", content: "Promoted — SnapFind" }, { property: "og:description", content: "Promote your photographer profile for R100/month." },
  ] }),
  component: Promoted,
});

function Promoted() {
  const [active, setActive] = useState(false);
  const next = new Date(); next.setMonth(next.getMonth() + 1);
  const preview = { ...PHOTOGRAPHERS[0]!, promoted: true };
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-promo">Promoted</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Get More Visibility</h1>
          <p className="mt-2 text-xl">Promote your profile for {zar(PROMOTED_PRICE)}/month.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="Current search visibility" value={active ? "Boosted" : "Standard"} sub={active ? "Ranking boost applied" : "Organic ranking only"} />
            <Stat label="Subscription" value={active ? "Active" : "Inactive"} sub={active ? `Renews ${next.toDateString()}` : "Cancel anytime"} />
          </div>
          {active ? <button onClick={() => { setActive(false); toast("Promoted cancelled", { description: "Stays active until the end of the billing period." }); }} className="mt-6 w-full rounded-full py-3 font-semibold ring-1 ring-border">Cancel Promoted</button>
            : <button onClick={() => { setActive(true); toast.success("Promoted activated", { description: `R100 charged. Next billing ${next.toDateString()}.` }); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-promo py-3 font-semibold text-background transition active:scale-95"><TrendingUp className="h-4 w-4" />Activate Promoted — R100/month</button>}
          <p className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">Promoted improves visibility in relevant search results. It does not guarantee bookings. You must still match the client's location, category and filters, and Promoted never grants verification badges.</p>
        </div>
        <div><p className="mb-2 text-sm text-muted-foreground">Badge preview</p><PhotographerCard p={preview} /></div>
      </div>
      <div className="mt-10 rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-xl">Payment history</h2>
        {(active ? [["Today", "R100", "Paid"]] : []).concat([["01 Jul 2026", "R100", "Paid"], ["01 Jun 2026", "R100", "Paid"]]).map(([d, a, s], i) => (
          <div key={i} className="flex justify-between border-b border-border py-2.5 text-sm"><span>{d}</span><span>{a}</span><span className="text-trust">{s}</span></div>))}
      </div>
    </div>
  );
}
