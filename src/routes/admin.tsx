import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PHOTOGRAPHERS, CATEGORIES, zar } from "@/lib/data";
import { PageHead, PromotedPill, Stat, TrustBadgeChip } from "@/components/snap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin — SnapFind" }, { name: "description", content: "Platform analytics, verification, payments and moderation." },
    { property: "og:title", content: "Admin — SnapFind" }, { property: "og:description", content: "Platform analytics, verification, payments and moderation." },
  ] }),
  component: Admin,
});

const TABS = ["Analytics", "Photographers", "Badge requests", "Bookings & payments", "Disputes", "Categories"] as const;

function Admin() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Analytics");
  const bookings = 1842, value = 2_310_400;
  const promo = PHOTOGRAPHERS.filter((p) => p.promoted).length;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageHead title="Admin" sub="Platform overview" />
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 scrollbar-none">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={cn("shrink-0 rounded-full px-4 py-1.5 text-sm ring-1 ring-border", tab === t && "bg-primary text-primary-foreground")}>{t}</button>)}</div>
      <div key={tab} className="animate-in fade-in duration-300">
        {tab === "Analytics" && <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Photographers" value="1,204" /><Stat label="Clients" value="18,392" /><Stat label="Total bookings" value={bookings.toLocaleString()} /><Stat label="Booking value" value={zar(value)} />
            <Stat label="10% commission revenue" value={zar(value * 0.1)} /><Stat label="R15 service fee revenue" value={zar(bookings * 15)} /><Stat label="Promoted revenue (mo)" value={zar(promo * 100 * 38)} /><Stat label="Active Promoted" value={String(promo * 38)} />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-lg">Most searched categories</h2>
              {[["Weddings", 92], ["Portraits", 74], ["Events", 61], ["Family", 48], ["Graduation", 33]].map(([n, v]: any) => <div key={n} className="mt-3"><div className="flex justify-between text-sm"><span>{n}</span><span>{v}%</span></div><div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent transition-all duration-700" style={{ width: `${v}%` }} /></div></div>)}</div>
            <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-lg">Most viewed photographers</h2>
              {PHOTOGRAPHERS.slice(0, 5).map((p, i) => <div key={p.id} className="mt-3 flex items-center gap-3 text-sm"><span className="w-4 text-muted-foreground">{i + 1}</span><img src={p.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><span className="flex-1">{p.business}</span><span>{(5200 - i * 730).toLocaleString()} views</span></div>)}
              <p className="mt-4 text-sm">Booking conversion rate: <b>6.8%</b></p></div>
          </div>
        </>}
        {tab === "Photographers" && <div className="space-y-2">{PHOTOGRAPHERS.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border"><img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /><div className="flex-1"><p className="font-semibold">{p.business} {p.promoted && <PromotedPill className="ml-1" />}</p><div className="mt-1 flex flex-wrap gap-1">{p.badges.map((b) => <TrustBadgeChip key={b} b={b} compact />)}</div></div>
            <button onClick={() => toast.success(`${p.business} verified`)} className="rounded-full px-3 py-1 text-sm ring-1 ring-border">Verify</button><button onClick={() => toast("Account suspended")} className="rounded-full px-3 py-1 text-sm text-destructive ring-1 ring-border">Suspend</button></div>))}</div>}
        {tab === "Badge requests" && <div className="space-y-2">{[["Pixel Works", "Business Verified", "CIPC certificate"], ["Kai Motion", "ID Verified", "ID document"], ["Frames by Sipho", "Portfolio Verified", "RAW samples"]].map(([n, b, d]) => (
          <div key={n} className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-border"><div><p className="font-semibold">{n} → {b}</p><p className="text-xs text-muted-foreground">Evidence: {d}</p></div><div className="flex gap-2"><button onClick={() => toast.success("Badge approved")} className="rounded-full bg-trust px-3 py-1 text-sm text-background">Approve</button><button onClick={() => toast("Rejected")} className="rounded-full px-3 py-1 text-sm ring-1 ring-border">Reject</button></div></div>))}</div>}
        {tab === "Bookings & payments" && <div className="overflow-x-auto rounded-3xl bg-card p-5 ring-1 ring-border"><table className="w-full text-sm"><thead className="text-left text-xs text-muted-foreground"><tr><th className="py-2">Booking</th><th>Price</th><th>Client paid</th><th>Commission</th><th>Service fee</th><th>Payout</th><th>Status</th></tr></thead>
          <tbody>{[1000, 2500, 3300, 1500].map((v, i) => <tr key={i} className="border-t border-border"><td className="py-2.5">BK-20{i}4</td><td>{zar(v)}</td><td>{zar(v + 15)}</td><td>{zar(v * 0.1)}</td><td>R15</td><td>{zar(v * 0.9)}</td><td>{i ? "Released" : "Held"}</td></tr>)}</tbody></table></div>}
        {tab === "Disputes" && <div className="rounded-2xl bg-card p-4 ring-1 ring-border"><p className="font-semibold">BK-1988 · Late delivery of photos</p><p className="text-sm text-muted-foreground">Client requests 30% refund. Funds held.</p><div className="mt-3 flex gap-2"><button onClick={() => toast("Partial refund issued")} className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">Partial refund</button><button onClick={() => toast("Payout released")} className="rounded-full px-3 py-1 text-sm ring-1 ring-border">Release payout</button></div></div>}
        {tab === "Categories" && <div className="grid grid-cols-2 gap-2 md:grid-cols-5">{CATEGORIES.map((c) => <div key={c.slug} className="overflow-hidden rounded-2xl ring-1 ring-border"><img src={c.img} alt="" className="h-20 w-full object-cover" /><p className="p-2 text-sm">{c.name}</p></div>)}</div>}
      </div>
    </div>
  );
}
