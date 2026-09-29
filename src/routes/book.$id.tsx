import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, CreditCard, Lock } from "lucide-react";
import { getPhotographer, zar, DAYS } from "@/lib/data";
import { FeeBreakdown } from "@/components/snap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$id")({
  validateSearch: z.object({ pkg: z.string().optional() }),
  loader: ({ params }) => { const p = getPhotographer(params.id); if (!p) throw notFound(); return p; },
  head: ({ loaderData: p }) => ({ meta: [
    { title: p ? `Book ${p.business} — SnapFind` : "Book — SnapFind" },
    { name: "description", content: "Secure step-by-step photographer booking with transparent fees." },
    { property: "og:title", content: "Book a photographer — SnapFind" },
    { property: "og:description", content: "Secure step-by-step booking with transparent fees." },
  ] }),
  notFoundComponent: () => <p className="py-20 text-center">Photographer not found.</p>,
  errorComponent: () => <p className="py-20 text-center">Couldn't load booking.</p>,
  component: Book,
});

const STEPS = ["Service", "Date & time", "Confirm", "Payment"];
const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function Book() {
  const p = Route.useLoaderData();
  const { pkg } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(p.packages.find((k) => k.name === pkg) ?? p.packages[0]!);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const done = step === 4;
  const pay = () => { setPaying(true); setTimeout(() => { setPaying(false); setStep(4); }, 1400); };
  const canNext = step === 0 || (step === 1 && date && time) || step === 2;

  if (done) return (
    <div className="mx-auto max-w-md px-4 py-20 text-center animate-in zoom-in-95 fade-in">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-trust text-background"><Check className="h-10 w-10" /></div>
      <h1 className="mt-6 font-display text-3xl">Booking confirmed</h1>
      <p className="mt-2 text-muted-foreground">{sel.name} with {p.business} on {date?.toDateString()} at {time}. Payment of {zar(sel.price + 15)} is held securely until your session is complete.</p>
      <div className="mt-6 flex justify-center gap-2"><Link to="/bookings" className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">View bookings</Link><Link to="/messages" className="rounded-full px-5 py-2.5 ring-1 ring-border">Chat</Link></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link to="/p/$id" params={{ id: p.id }} className="text-sm text-muted-foreground">← {p.business}</Link>
      <div className="mt-4 flex gap-2">{STEPS.map((s, i) => <div key={s} className="flex-1"><div className={cn("h-1 rounded-full bg-muted transition-colors duration-500", i <= step && "bg-accent")} /><p className={cn("mt-1 text-xs", i === step ? "font-semibold" : "text-muted-foreground")}>{s}</p></div>)}</div>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_340px]">
        <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
          {step === 0 && <div className="space-y-3"><h1 className="font-display text-2xl">Choose a package</h1>{p.packages.map((k) => (
            <button key={k.name} onClick={() => setSel(k)} className={cn("w-full rounded-2xl p-4 text-left ring-1 ring-border transition", sel.name === k.name && "ring-2 ring-accent")}>
              <div className="flex justify-between font-semibold"><span>{k.name}</span><span>{zar(k.price)}</span></div><p className="text-sm text-muted-foreground">{k.desc}</p></button>))}</div>}
          {step === 1 && <div><h1 className="font-display text-2xl">Pick a date & time</h1>
            <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">{days.map((d) => { const ok = p.availableDays.includes(d.getDay()); return (
              <button key={d.toISOString()} disabled={!ok} onClick={() => setDate(d)} className={cn("w-16 shrink-0 rounded-2xl py-3 text-center ring-1 ring-border transition disabled:opacity-30", date?.toDateString() === d.toDateString() && "bg-primary text-primary-foreground")}>
                <p className="text-xs">{DAYS[d.getDay()]}</p><p className="text-lg font-semibold">{d.getDate()}</p></button>); })}</div>
            <div className="mt-4 grid grid-cols-3 gap-2">{TIMES.map((t) => <button key={t} onClick={() => setTime(t)} className={cn("rounded-xl py-2.5 ring-1 ring-border", time === t && "bg-primary text-primary-foreground")}>{t}</button>)}</div></div>}
          {step === 2 && <div className="space-y-4"><h1 className="font-display text-2xl">Confirm details</h1>
            <div className="rounded-2xl p-4 ring-1 ring-border"><p className="font-semibold">{sel.name} · {p.business}</p><p className="text-sm text-muted-foreground">{date?.toDateString()} at {time}</p></div>
            <div className="rounded-2xl bg-muted/60 p-4 text-sm"><p className="font-semibold">Cancellation rules</p><ul className="mt-1 list-disc pl-5 text-muted-foreground"><li>Free cancellation up to 7 days before</li><li>50% refund 2–7 days before</li><li>No refund within 48 hours</li><li>The R15 service fee is non-refundable</li></ul></div></div>}
          {step === 3 && <div className="space-y-3"><h1 className="font-display text-2xl">Payment</h1>
            <input placeholder="Card number" defaultValue="4242 4242 4242 4242" className="w-full rounded-xl bg-muted px-4 py-3 outline-none" />
            <div className="grid grid-cols-2 gap-2"><input placeholder="MM/YY" defaultValue="12/28" className="rounded-xl bg-muted px-4 py-3 outline-none" /><input placeholder="CVC" defaultValue="123" className="rounded-xl bg-muted px-4 py-3 outline-none" /></div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" />Demo checkout — no real card is charged.</p></div>}
        </div>
        <aside className="space-y-3 md:sticky md:top-20 md:self-start">
          <FeeBreakdown price={sel.price} showPhotographer={false} />
          {step < 3 ? <button disabled={!canNext} onClick={() => setStep(step + 1)} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition active:scale-95 disabled:opacity-40">Continue</button>
            : <button onClick={pay} disabled={paying} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-semibold text-accent-foreground transition active:scale-95"><CreditCard className="h-4 w-4" />{paying ? "Processing…" : `Pay ${zar(sel.price + 15)}`}</button>}
          {step > 0 && <button onClick={() => setStep(step - 1)} className="w-full text-sm text-muted-foreground">Back</button>}
        </aside>
      </div>
    </div>
  );
}
