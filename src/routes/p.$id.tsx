import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Flag, Heart, MapPin, MessageCircle, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getPhotographer, catName, zar, DAYS } from "@/lib/data";
import { PromotedPill, Stars, TrustBadgeChip, useFavourites } from "@/components/snap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/p/$id")({
  loader: ({ params }) => { const p = getPhotographer(params.id); if (!p) throw notFound(); return p; },
  head: ({ loaderData: p }) => p ? { meta: [
    { title: `${p.business} — ${p.city} photographer | SnapFind` },
    { name: "description", content: p.about },
    { property: "og:title", content: `${p.business} on SnapFind` },
    { property: "og:description", content: p.about },
    { property: "og:image", content: p.portfolio[0] },
    { name: "twitter:image", content: p.portfolio[0] },
  ] } : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <p className="py-20 text-center">Photographer not found.</p>,
  errorComponent: () => <p className="py-20 text-center">Couldn't load this profile.</p>,
  component: Profile,
});

function Profile() {
  const p = Route.useLoaderData();
  const { favs, toggle } = useFavourites();
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid h-[52vh] gap-2 overflow-hidden rounded-[2rem] md:grid-cols-[2fr_1fr]">
        <img src={p.portfolio[0]} alt="" className="h-full w-full object-cover" />
        <div className="hidden grid-rows-2 gap-2 md:grid">{p.portfolio.slice(1).map((s) => <img key={s} src={s} alt="" className="h-full w-full object-cover" />)}</div>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <img src={p.avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-4 ring-background" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-3xl">{p.business}</h1>{p.promoted && <PromotedPill />}</div>
              <p className="text-muted-foreground">{p.name} · <MapPin className="inline h-3.5 w-3.5" /> {p.city}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm"><Stars r={p.rating} n={p.reviews} /><span><CheckCircle2 className="mr-1 inline h-4 w-4" />{p.completed} bookings</span><span><Clock className="mr-1 inline h-4 w-4" />Replies in ~{p.responseMins} min</span></div>
            </div>
            <button aria-label="Save" onClick={() => toggle(p.id)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-border"><Heart className={cn("h-5 w-5", favs.includes(p.id) && "fill-destructive text-destructive")} /></button>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Earned trust badges</h2>
            <div className="flex flex-wrap gap-2">{p.badges.length ? p.badges.map((b) => <TrustBadgeChip key={b} b={b} />) : <span className="text-sm text-muted-foreground">No badges earned yet.</span>}</div>
            {p.promoted && <p className="mt-2 text-xs text-muted-foreground">"Promoted" is a paid visibility placement and is not a verification.</p>}
          </div>
          <div><h2 className="font-display text-xl">About</h2><p className="mt-2 text-muted-foreground">{p.about}</p>
            <div className="mt-3 flex flex-wrap gap-2">{p.categories.map((c) => <span key={c} className="rounded-full bg-muted px-3 py-1 text-xs">{catName(c)}</span>)}</div></div>
          <div><h2 className="font-display text-xl">Portfolio</h2>
            <div className="mt-3 columns-2 gap-3 md:columns-3">{[...p.portfolio, ...p.portfolio].map((s, i) => <img key={i} src={s} alt="" loading="lazy" className={cn("mb-3 w-full rounded-2xl object-cover transition hover:opacity-90", i % 2 ? "aspect-square" : "aspect-[3/4]")} />)}</div></div>
          <div><h2 className="font-display text-xl">Availability</h2>
            <div className="mt-3 grid grid-cols-7 gap-2">{DAYS.map((d, i) => <div key={d} className={cn("rounded-xl py-3 text-center text-sm ring-1 ring-border", p.availableDays.includes(i) ? "bg-trust/12 font-semibold text-trust" : "text-muted-foreground line-through")}>{d}</div>)}</div></div>
          <div><h2 className="font-display text-xl">Reviews</h2>
            <div className="mt-3 space-y-3">{p.reviewList.map((r) => <div key={r.name} className="rounded-2xl bg-card p-4 ring-1 ring-border"><div className="flex justify-between"><span className="font-semibold">{r.name}</span><Stars r={r.rating} /></div><p className="mt-1 text-sm text-muted-foreground">{r.text}</p><p className="mt-1 text-xs text-muted-foreground">{r.date}</p></div>)}</div></div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <button onClick={() => toast("Report submitted", { description: "Our trust team will review this profile." })} className="flex items-center gap-1 hover:text-foreground"><Flag className="h-4 w-4" />Report profile</button>
            <button onClick={() => toast("User blocked")} className="flex items-center gap-1 hover:text-foreground"><Ban className="h-4 w-4" />Block</button>
          </div>
        </div>
        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border">
            <h2 className="font-display text-xl">Packages</h2>
            <div className="mt-3 space-y-2">{p.packages.map((k) => (
              <Link key={k.name} to="/book/$id" params={{ id: p.id }} search={{ pkg: k.name }} className="block rounded-2xl p-3 ring-1 ring-border transition hover:ring-accent">
                <div className="flex justify-between font-semibold"><span>{k.name}</span><span>{zar(k.price)}</span></div><p className="text-xs text-muted-foreground">{k.desc}</p>
              </Link>))}</div>
            <Link to="/book/$id" params={{ id: p.id }} className="mt-4 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground transition active:scale-95">Book from {zar(p.priceFrom)}</Link>
            <Link to="/messages" className="mt-2 flex items-center justify-center gap-2 rounded-full py-3 text-sm ring-1 ring-border"><MessageCircle className="h-4 w-4" />Message</Link>
          </div>
        </aside>
      </div>
      <Link to="/book/$id" params={{ id: p.id }} className="fixed inset-x-4 bottom-24 z-30 rounded-full bg-accent py-3.5 text-center font-semibold text-accent-foreground shadow-lift lg:hidden">Book from {zar(p.priceFrom)}</Link>
    </div>
  );
}
