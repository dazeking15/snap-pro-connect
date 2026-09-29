import { createFileRoute, Link } from "@tanstack/react-router";
import { Megaphone, Upload } from "lucide-react";
import { toast } from "sonner";
import { PHOTOGRAPHERS, calcFees, zar, DAYS } from "@/lib/data";
import { FeeBreakdown, PageHead, Stat, TrustBadgeChip, PromotedPill } from "@/components/snap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Photographer dashboard — SnapFind" }, { name: "description", content: "Earnings, bookings, payouts and portfolio management." },
    { property: "og:title", content: "Photographer dashboard — SnapFind" }, { property: "og:description", content: "Earnings, bookings, payouts and portfolio management." },
  ] }),
  component: Dashboard,
});

const tx = [
  { id: "TX-1042", client: "Thandi M.", date: "24 Sep", gross: 2500, status: "Pending" },
  { id: "TX-1039", client: "James K.", date: "18 Sep", gross: 3300, status: "Paid out" },
  { id: "TX-1033", client: "Aisha P.", date: "09 Sep", gross: 1500, status: "Paid out" },
  { id: "TX-1027", client: "Neo S.", date: "02 Sep", gross: 1000, status: "Paid out" },
];

function Dashboard() {
  const me = PHOTOGRAPHERS[0]!;
  const gross = tx.reduce((s, t) => s + t.gross, 0);
  const fees = tx.reduce((s, t) => s + calcFees(t.gross).commission, 0);
  const pending = tx.filter((t) => t.status === "Pending").reduce((s, t) => s + calcFees(t.gross).photographerReceives, 0);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center gap-3"><img src={me.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /><PageHead title={`Hi, ${me.name.split(" ")[0]}`} sub={me.business} /></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Gross this month" value={zar(gross)} /><Stat label="Platform fees (10%)" value={zar(fees)} />
        <Stat label="Net earnings" value={zar(gross - fees)} /><Stat label="Pending payout" value={zar(pending)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-xl">Booking requests</h2>
            {[["Thandi M.", "Family · Sat 3 Oct", 2500], ["Kabelo R.", "Portrait · Sun 11 Oct", 1500]].map(([n, d, p]: any) => (
              <div key={n} className="mt-3 flex items-center justify-between rounded-2xl p-3 ring-1 ring-border"><div><p className="font-semibold">{n}</p><p className="text-xs text-muted-foreground">{d} · you receive {zar(calcFees(p).photographerReceives)}</p></div>
                <div className="flex gap-2"><button onClick={() => toast.success("Booking accepted")} className="rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground">Accept</button><button onClick={() => toast("Declined")} className="rounded-full px-3 py-1.5 text-sm ring-1 ring-border">Decline</button></div></div>))}
          </div>
          <div className="overflow-x-auto rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-xl">Transactions & payouts</h2>
            <table className="mt-3 w-full text-sm"><thead className="text-left text-xs text-muted-foreground"><tr><th className="py-2">ID</th><th>Client</th><th>Gross</th><th>Commission</th><th>Net</th><th>Status</th></tr></thead>
              <tbody>{tx.map((t) => { const f = calcFees(t.gross); return <tr key={t.id} className="border-t border-border"><td className="py-2.5">{t.id}</td><td>{t.client}</td><td>{zar(t.gross)}</td><td>-{zar(f.commission)}</td><td className="font-semibold">{zar(f.photographerReceives)}</td><td><span className={cn("rounded-full px-2 py-0.5 text-xs", t.status === "Pending" ? "bg-accent/20" : "bg-trust/12 text-trust")}>{t.status}</span></td></tr>; })}</tbody></table>
            <p className="mt-3 text-xs text-muted-foreground">Payouts to FNB ••4821 every Friday.</p>
          </div>
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><div className="flex justify-between"><h2 className="font-display text-xl">Portfolio</h2><button className="flex items-center gap-1 text-sm"><Upload className="h-4 w-4" />Upload</button></div>
            <div className="mt-3 grid grid-cols-3 gap-2">{me.portfolio.map((s) => <img key={s} src={s} alt="" className="aspect-square rounded-xl object-cover" />)}</div></div>
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-xl">Availability</h2>
            <div className="mt-3 grid grid-cols-7 gap-2">{DAYS.map((d, i) => <button key={d} className={cn("rounded-xl py-3 text-sm ring-1 ring-border", me.availableDays.includes(i) && "bg-trust/12 font-semibold text-trust")}>{d}</button>)}</div></div>
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-xl">Services & pricing</h2>
            {me.packages.map((k) => <div key={k.name} className="mt-2 flex justify-between border-b border-border py-2 text-sm"><span>{k.name} — {k.desc}</span><span className="font-semibold">{zar(k.price)}</span></div>)}</div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-lg">Example payout</h2><p className="mb-3 text-xs text-muted-foreground">How each booking is split</p><FeeBreakdown price={2500} /></div>
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border"><h2 className="font-display text-lg">Earned badges</h2><div className="mt-2 flex flex-wrap gap-1.5">{me.badges.map((b) => <TrustBadgeChip key={b} b={b} />)}</div>
            <button onClick={() => toast("Documents submitted for review")} className="mt-3 text-sm underline">Apply for Business Verified</button></div>
          <div className="rounded-3xl border border-dashed border-promo p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg">Visibility</h2><PromotedPill /></div>
            <p className="mt-1 text-sm text-muted-foreground">Status: <b className="text-foreground">Not active</b></p>
            <Link to="/promoted" className="mt-3 inline-flex items-center gap-1 rounded-full bg-promo px-4 py-2 text-sm font-semibold text-background"><Megaphone className="h-4 w-4" />Manage Promoted</Link></div>
          <div className="grid grid-cols-2 gap-3"><Stat label="Upcoming" value="4" /><Stat label="Completed" value={String(me.completed)} /><Stat label="Rating" value={String(me.rating)} sub={`${me.reviews} reviews`} /><Stat label="Unread" value="3" sub="messages" /></div>
        </aside>
      </div>
    </div>
  );
}
