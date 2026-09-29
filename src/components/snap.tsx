import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, Megaphone, MapPin, Star, Zap, Award, ShieldCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { type Photographer, type TrustBadge, catName, zar, DAYS } from "@/lib/data";
import { cn } from "@/lib/utils";

const badgeIcon: Record<TrustBadge, typeof BadgeCheck> = {
  "Verified Photographer": BadgeCheck, "ID Verified": ShieldCheck, "Portfolio Verified": BadgeCheck, "Business Verified": ShieldCheck,
  "Top Rated": Star, Experienced: Award, "Fast Responder": Zap,
};

/** Earned trust badge — solid, verification styling. Never used for paid promotion. */
export function TrustBadgeChip({ b, compact }: { b: TrustBadge; compact?: boolean }) {
  const I = badgeIcon[b];
  return (
    <span title={b} className="inline-flex items-center gap-1 rounded-full bg-trust/12 px-2 py-0.5 text-[11px] font-semibold text-trust">
      <I className="h-3.5 w-3.5" />{!compact && b}
    </span>
  );
}

/** Paid visibility label — dashed outline, ad icon. Deliberately looks nothing like trust badges. */
export function PromotedPill({ className }: { className?: string }) {
  return (
    <span title="Paid placement" className={cn("inline-flex items-center gap-1 rounded-md border border-dashed border-promo bg-background/85 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-promo backdrop-blur", className)}>
      <Megaphone className="h-3 w-3" />Promoted
    </span>
  );
}

export function useFavourites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    const read = () => setFavs(JSON.parse(localStorage.getItem("snap-favs") || "[]"));
    read(); window.addEventListener("favs", read); return () => window.removeEventListener("favs", read);
  }, []);
  const toggle = (id: string) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    localStorage.setItem("snap-favs", JSON.stringify(next)); window.dispatchEvent(new Event("favs"));
  };
  return { favs, toggle };
}

export function Stars({ r, n }: { r: number; n?: number }) {
  return <span className="inline-flex items-center gap-1 text-sm font-semibold"><Star className="h-4 w-4 fill-accent text-accent" />{r.toFixed(1)}{n !== undefined && <span className="font-normal text-muted-foreground">({n})</span>}</span>;
}

export function PhotographerCard({ p }: { p: Photographer }) {
  const { favs, toggle } = useFavourites();
  const [i, setI] = useState(0);
  const fav = favs.includes(p.id);
  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-none" onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          {p.portfolio.map((src) => <img key={src} src={src} alt={`${p.business} portfolio`} loading="lazy" className="h-full w-full shrink-0 snap-center object-cover transition duration-700 group-hover:scale-[1.03]" />)}
        </div>
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">{p.portfolio.map((_, k) => <span key={k} className={cn("h-1.5 rounded-full bg-background/80 transition-all", k === i ? "w-4" : "w-1.5 opacity-60")} />)}</div>
        {p.promoted && <PromotedPill className="absolute left-3 top-3" />}
        <button aria-label="Save photographer" onClick={() => toggle(p.id)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 backdrop-blur transition active:scale-90">
          <Heart className={cn("h-4 w-4", fav && "fill-destructive text-destructive")} />
        </button>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h3 className="font-display text-lg leading-tight">{p.business}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.city} · {p.distanceKm} km</p>
            </div>
          </div>
          <Stars r={p.rating} n={p.reviews} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{catName(p.categories[0]!)}</span>
          {p.badges.slice(0, 2).map((b) => <TrustBadgeChip key={b} b={b} />)}
          {p.badges.length > 2 && <span className="text-[11px] text-muted-foreground">+{p.badges.length - 2}</span>}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />Available {p.availableDays.map((d) => DAYS[d]).join(", ")}</p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-sm"><span className="text-muted-foreground">From </span><span className="font-bold">{zar(p.priceFrom)}</span></p>
          <div className="flex gap-2">
            <Link to="/p/$id" params={{ id: p.id }} className="rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-border transition hover:bg-muted">View</Link>
            <Link to="/book/$id" params={{ id: p.id }} className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95">Book now</Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function FeeBreakdown({ price, showPhotographer = true }: { price: number; showPhotographer?: boolean }) {
  const f = { serviceFee: 15, clientPays: price + 15, commission: price * 0.1, net: price * 0.9 };
  const Row = ({ l, v, b }: { l: string; v: string; b?: boolean }) => <div className={cn("flex justify-between py-1.5 text-sm", b && "font-bold text-base")}><span className={b ? "" : "text-muted-foreground"}>{l}</span><span>{v}</span></div>;
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <Row l="Photographer booking price" v={zar(price)} />
      <Row l="Client service fee" v={zar(f.serviceFee)} />
      <div className="my-1 border-t border-border" />
      <Row l="Client pays" v={zar(f.clientPays)} b />
      {showPhotographer && <>
        <div className="my-2 border-t border-dashed border-border" />
        <Row l="Platform commission (10%)" v={zar(f.commission)} />
        <Row l="Photographer receives" v={zar(f.net)} />
      </>}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return <div className="rounded-2xl bg-card p-4 ring-1 ring-border"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl">{value}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>;
}

export function PageHead({ title, sub }: { title: string; sub?: string }) {
  return <div className="mb-6"><h1 className="font-display text-3xl md:text-4xl">{title}</h1>{sub && <p className="mt-1 text-muted-foreground">{sub}</p>}</div>;
}
