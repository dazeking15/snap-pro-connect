import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Calendar, MapPin, Search } from "lucide-react";
import { CATEGORIES, PHOTOGRAPHERS } from "@/lib/data";
import { PhotographerCard } from "@/components/snap";

const HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=75";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapFind — Find the right photographer for your moment" },
      { name: "description", content: "Discover, compare, book and pay trusted photographers near you. Transparent pricing, verified pros." },
      { property: "og:title", content: "SnapFind — Find the right photographer" },
      { property: "og:description", content: "Discover, compare, book and pay trusted photographers near you." },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
    ],
  }),
  component: Home,
});

function Section({ title, sub, children, to }: { title: string; sub?: string; children: React.ReactNode; to?: boolean }) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <div className="mb-5 flex items-end justify-between"><div><h2 className="font-display text-2xl md:text-3xl">{title}</h2>{sub && <p className="text-sm text-muted-foreground">{sub}</p>}</div>
        {to && <Link to="/search" className="flex items-center gap-1 text-sm font-medium">See all <ArrowRight className="h-4 w-4" /></Link>}</div>
      {children}
    </section>
  );
}

function Home() {
  const nav = useNavigate();
  const [q, setQ] = useState(""); const [city, setCity] = useState(""); const [date, setDate] = useState("");
  const go = () => nav({ to: "/search", search: { q: q || undefined, city: city || undefined, day: date ? new Date(date).getDay() : undefined } });
  const promoted = PHOTOGRAPHERS.filter((p) => p.promoted);
  const top = [...PHOTOGRAPHERS].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const recent = [...PHOTOGRAPHERS].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 3);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src={HERO} alt="Wedding couple in golden light" className="absolute inset-0 -z-10 h-full w-full scale-105 object-cover animate-in zoom-in-110 duration-[2000ms]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/30 via-foreground/50 to-background" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 md:pb-32 md:pt-40">
          <h1 className="max-w-3xl font-display text-5xl leading-[1.02] text-background md:text-7xl dark:text-foreground animate-in slide-in-from-bottom-4 fade-in duration-700">Find the right photographer for your moment.</h1>
          <p className="mt-4 max-w-lg text-lg text-background/85 dark:text-foreground/80">Browse real portfolios, compare transparent prices and book in minutes.</p>
          <form onSubmit={(e) => { e.preventDefault(); go(); }} className="mt-8 grid gap-2 rounded-3xl bg-background p-2 shadow-lift md:grid-cols-[1.3fr_1fr_1fr_auto]">
            <label className="flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-muted"><Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What are you looking for?" className="w-full bg-transparent outline-none" /></label>
            <label className="flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-muted"><MapPin className="h-4 w-4 text-muted-foreground" /><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Where?" className="w-full bg-transparent outline-none" /></label>
            <label className="flex items-center gap-2 rounded-2xl px-4 py-3 hover:bg-muted"><Calendar className="h-4 w-4 text-muted-foreground" /><input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="When?" className="w-full bg-transparent outline-none" /></label>
            <button className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95">Search</button>
          </form>
        </div>
      </section>

      <Section title="Popular categories">
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/search" search={{ category: c.slug }} className="group relative h-44 w-36 shrink-0 snap-start overflow-hidden rounded-3xl md:h-56 md:w-44">
              <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <span className="absolute bottom-3 left-3 font-display text-lg text-background dark:text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Featured photographers" sub="Hand-picked for outstanding work" to><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{top.map((p) => <PhotographerCard key={p.id} p={p} />)}</div></Section>
      <Section title="Promoted photographers" sub="Paid placements — clearly labelled" to><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{promoted.map((p) => <PhotographerCard key={p.id} p={p} />)}</div></Section>

      <Section title="How it works">
        <div className="grid gap-4 md:grid-cols-4">
          {["Search by style, place and date", "Compare portfolios & reviews", "Book and pay securely", "Enjoy your photos & review"].map((t, i) => (
            <div key={t} className="rounded-3xl bg-card p-6 ring-1 ring-border"><span className="font-display text-4xl text-accent">0{i + 1}</span><p className="mt-3 font-medium">{t}</p></div>
          ))}
        </div>
      </Section>

      <Section title="Recently joined"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recent.map((p) => <PhotographerCard key={p.id} p={p} />)}</div></Section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-10 text-primary-foreground md:p-16">
          <h2 className="max-w-xl font-display text-4xl md:text-5xl">Earn from your photography. Join SnapFind.</h2>
          <p className="mt-3 max-w-md opacity-80">Get discovered by local clients, manage bookings, and get paid — keep 90% of every booking.</p>
          <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:gap-3">Start earning <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
