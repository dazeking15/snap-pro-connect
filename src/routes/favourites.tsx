import { createFileRoute, Link } from "@tanstack/react-router";
import { PHOTOGRAPHERS } from "@/lib/data";
import { PageHead, PhotographerCard, useFavourites } from "@/components/snap";

export const Route = createFileRoute("/favourites")({
  head: () => ({ meta: [
    { title: "Saved photographers — SnapFind" }, { name: "description", content: "Your favourite photographers in one place." },
    { property: "og:title", content: "Saved photographers — SnapFind" }, { property: "og:description", content: "Your favourite photographers in one place." },
  ] }),
  component: () => {
    const { favs } = useFavourites();
    const list = PHOTOGRAPHERS.filter((p) => favs.includes(p.id));
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PageHead title="Saved" sub="Photographers you've hearted" />
        {list.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PhotographerCard key={p.id} p={p} />)}</div>
          : <div className="py-20 text-center text-muted-foreground">Nothing saved yet. <Link to="/search" className="font-semibold text-foreground underline">Explore photographers</Link></div>}
      </div>
    );
  },
});
