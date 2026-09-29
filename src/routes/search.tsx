import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { CATEGORIES, DAYS, searchPhotographers } from "@/lib/data";
import { PhotographerCard } from "@/components/snap";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const schema = z.object({
  q: z.string().optional(), city: z.string().optional(), category: z.string().optional(),
  maxPrice: z.number().optional(), minRating: z.number().optional(), day: z.number().optional(),
  maxDistance: z.number().optional(), verifiedOnly: z.boolean().optional(), promotedOnly: z.boolean().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: schema,
  head: () => ({ meta: [
    { title: "Search photographers — SnapFind" },
    { name: "description", content: "Filter photographers by location, category, price, rating and availability." },
    { property: "og:title", content: "Search photographers — SnapFind" },
    { property: "og:description", content: "Filter photographers by location, category, price, rating and availability." },
  ] }),
  component: SearchPage,
});

function SearchPage() {
  const f = Route.useSearch();
  const nav = useNavigate({ from: "/search" });
  const set = (patch: Partial<typeof f>) => nav({ search: (s) => ({ ...s, ...patch }), replace: true });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, [JSON.stringify(f)]);
  const results = searchPhotographers(f);
  const input = "w-full rounded-xl bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex gap-2">
        <input value={f.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Search style, name…" className={input} />
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1 rounded-xl px-3 ring-1 ring-border md:hidden"><SlidersHorizontal className="h-4 w-4" /></button>
      </div>
      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 scrollbar-none">
        <button onClick={() => set({ category: undefined })} className={cn("shrink-0 rounded-full px-4 py-1.5 text-sm ring-1 ring-border", !f.category && "bg-primary text-primary-foreground")}>All</button>
        {CATEGORIES.map((c) => <button key={c.slug} onClick={() => set({ category: c.slug })} className={cn("shrink-0 rounded-full px-4 py-1.5 text-sm ring-1 ring-border transition", f.category === c.slug && "bg-primary text-primary-foreground")}>{c.name}</button>)}
      </div>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className={cn("space-y-4 rounded-3xl bg-card p-4 ring-1 ring-border md:block md:self-start", !open && "hidden")}>
          <div><label className="text-xs font-semibold">Location</label><input value={f.city ?? ""} onChange={(e) => set({ city: e.target.value || undefined })} placeholder="City" className={input} /></div>
          <div><label className="text-xs font-semibold">Max distance: {f.maxDistance ?? "any"} km</label><input type="range" min={1} max={30} value={f.maxDistance ?? 30} onChange={(e) => set({ maxDistance: +e.target.value === 30 ? undefined : +e.target.value })} className="w-full accent-[var(--accent)]" /></div>
          <div><label className="text-xs font-semibold">Max starting price: {f.maxPrice ? `R${f.maxPrice}` : "any"}</label><input type="range" min={500} max={2000} step={100} value={f.maxPrice ?? 2000} onChange={(e) => set({ maxPrice: +e.target.value === 2000 ? undefined : +e.target.value })} className="w-full accent-[var(--accent)]" /></div>
          <div><label className="text-xs font-semibold">Minimum rating</label>
            <div className="mt-1 flex gap-1">{[undefined, 4, 4.5, 4.8].map((r) => <button key={String(r)} onClick={() => set({ minRating: r })} className={cn("flex-1 rounded-lg py-1 text-xs ring-1 ring-border", f.minRating === r && "bg-primary text-primary-foreground")}>{r ?? "Any"}</button>)}</div></div>
          <div><label className="text-xs font-semibold">Available on</label>
            <div className="mt-1 grid grid-cols-7 gap-1">{DAYS.map((d, i) => <button key={d} onClick={() => set({ day: f.day === i ? undefined : i })} className={cn("rounded-lg py-1 text-[10px] ring-1 ring-border", f.day === i && "bg-primary text-primary-foreground")}>{d[0]}</button>)}</div></div>
          <label className="flex items-center justify-between text-sm">Verified only <input type="checkbox" checked={!!f.verifiedOnly} onChange={(e) => set({ verifiedOnly: e.target.checked || undefined })} /></label>
          <label className="flex items-center justify-between text-sm">Promoted only <input type="checkbox" checked={!!f.promotedOnly} onChange={(e) => set({ promotedOnly: e.target.checked || undefined })} /></label>
        </aside>
        <div>
          <p className="mb-3 text-sm text-muted-foreground">{results.length} photographers · ranked by relevance, distance, availability & reviews. Promoted listings get a small labelled boost but must match your filters.</p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="space-y-3"><Skeleton className="aspect-[4/3] rounded-3xl" /><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>)
              : results.map((p) => <PhotographerCard key={p.id} p={p} />)}
          </div>
          {!loading && results.length === 0 && <p className="py-20 text-center text-muted-foreground">No photographers match. Try widening your filters.</p>}
        </div>
      </div>
    </div>
  );
}
