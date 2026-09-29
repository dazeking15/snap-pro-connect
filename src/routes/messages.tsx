import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { PHOTOGRAPHERS } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [
    { title: "Messages — SnapFind" }, { name: "description", content: "Chat with your photographers." },
    { property: "og:title", content: "Messages — SnapFind" }, { property: "og:description", content: "Chat with your photographers." },
  ] }),
  component: Messages,
});

function Messages() {
  const [active, setActive] = useState(PHOTOGRAPHERS[0]!);
  const [msgs, setMsgs] = useState([{ me: false, t: "Hi! Thanks for booking. Any shots you definitely want?" }, { me: true, t: "Yes — golden hour portraits by the lake please!" }]);
  const [text, setText] = useState("");
  return (
    <div className="mx-auto grid h-[calc(100vh-10rem)] max-w-6xl gap-4 px-4 py-6 md:grid-cols-[280px_1fr]">
      <div className="hidden space-y-1 overflow-y-auto md:block">{PHOTOGRAPHERS.slice(0, 4).map((p) => (
        <button key={p.id} onClick={() => setActive(p)} className={cn("flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-muted", active.id === p.id && "bg-muted")}>
          <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="font-semibold">{p.business}</p><p className="text-xs text-muted-foreground">Replies in ~{p.responseMins} min</p></div></button>))}</div>
      <div className="flex flex-col rounded-3xl bg-card ring-1 ring-border">
        <div className="flex items-center gap-3 border-b border-border p-4"><img src={active.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><p className="font-semibold">{active.business}</p></div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">{msgs.map((m, i) => <div key={i} className={cn("max-w-[75%] rounded-2xl px-4 py-2 text-sm animate-in fade-in slide-in-from-bottom-1", m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-muted")}>{m.t}</div>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { setMsgs([...msgs, { me: true, t: text }]); setText(""); } }} className="flex gap-2 border-t border-border p-3">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none" />
          <button aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </div>
  );
}
