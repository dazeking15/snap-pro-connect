import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Aperture, Bell, CalendarCheck, Heart, Home, MessageCircle, Moon, Search, Sun, User } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page is out of frame.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div><h1 className="text-xl font-semibold">This page didn't load</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button></div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SnapFind — Find the right photographer" },
      { name: "description", content: "Discover, compare, book and pay photographers near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const d = localStorage.getItem("snap-theme") === "dark"; setDark(d); document.documentElement.classList.toggle("dark", d); }, []);
  const flip = () => { const d = !dark; setDark(d); localStorage.setItem("snap-theme", d ? "dark" : "light"); document.documentElement.classList.toggle("dark", d); };
  return <button aria-label="Toggle theme" onClick={flip} className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-border transition hover:bg-muted">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>;
}

function AccountButton() {
  const { user } = useAuth();
  if (!user) return <Link to="/auth" className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">Sign in</Link>;
  return <button onClick={() => supabase.auth.signOut()} className="rounded-full px-3 py-1.5 text-sm ring-1 ring-border hover:bg-muted">Sign out</button>;
}

const desk = [
  { to: "/search", l: "Explore" }, { to: "/bookings", l: "Bookings" }, { to: "/messages", l: "Messages" },
  { to: "/dashboard", l: "For photographers" }, { to: "/admin", l: "Admin" },
] as const;
const mob = [
  { to: "/", l: "Home", I: Home }, { to: "/search", l: "Search", I: Search }, { to: "/favourites", l: "Saved", I: Heart },
  { to: "/bookings", l: "Bookings", I: CalendarCheck }, { to: "/messages", l: "Messages", I: MessageCircle }, { to: "/dashboard", l: "Profile", I: User },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl"><Aperture className="h-6 w-6 text-accent" />SnapFind</Link>
          <nav className="hidden gap-1 md:flex">
            {desk.map((n) => <Link key={n.to} to={n.to} className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground" activeProps={{ className: "!text-foreground bg-muted" }}>{n.l}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/notifications" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full ring-1 ring-border hover:bg-muted"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" /></Link>
            <ThemeToggle />
            <Link to="/favourites" className="hidden rounded-full px-3 py-1.5 text-sm ring-1 ring-border hover:bg-muted md:inline-flex"><Heart className="mr-1 h-4 w-4" />Saved</Link>
            <AccountButton />
          </div>
        </div>
      </header>
      <main className="animate-in fade-in pb-24 duration-500 md:pb-0"><Outlet /></main>
      <footer className="mt-20 hidden border-t border-border py-10 text-center text-sm text-muted-foreground md:block">© 2026 SnapFind · Secure payments · Clear refund rules · Verified photographers</footer>
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-border bg-background/90 p-1.5 shadow-lift backdrop-blur-xl md:hidden">
        {mob.map(({ to, l, I }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] text-muted-foreground transition" activeProps={{ className: "!text-foreground bg-muted" }}>
            <I className="h-5 w-5" />{l}
          </Link>
        ))}
      </nav>
      <Toaster />
    </QueryClientProvider>
  );
}
