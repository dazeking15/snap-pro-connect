import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Aperture } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

const safe = (r?: string) => (r && r.startsWith("/") && !r.startsWith("//") ? r : "/");

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Sign in — SnapFind" }, { name: "description", content: "Sign in or create your SnapFind account." },
    { property: "og:title", content: "Sign in — SnapFind" }, { property: "og:description", content: "Sign in or create your SnapFind account." },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: safe(redirect) }); }, [user, redirect, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + safe(redirect), data: { full_name: name } } });
      if (error) toast.error(error.message); else toast.success("Check your email", { description: "Click the link we sent to confirm your account." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="text-center"><Aperture className="mx-auto h-10 w-10 text-accent" /><h1 className="mt-3 font-display text-3xl">{mode === "in" ? "Welcome back" : "Create your account"}</h1></div>
      <button onClick={google} className="mt-8 w-full rounded-full py-3 font-semibold ring-1 ring-border transition hover:bg-muted">Continue with Google</button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
      <form onSubmit={submit} className="space-y-3">
        {mode === "up" && <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-muted px-4 py-3 outline-none" />}
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl bg-muted px-4 py-3 outline-none" />
        <input required type="password" minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl bg-muted px-4 py-3 outline-none" />
        <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}</button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-sm text-muted-foreground">{mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}</button>
    </div>
  );
}
