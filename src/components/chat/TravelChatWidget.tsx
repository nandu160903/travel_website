"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Name a town or landmark and I'll suggest nearby places worth a stop—viewpoints, nature, heritage, markets. Example: “Places near Manali” or “Munnar”.",
};

export function TravelChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const hiddenRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/vault");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setError("");
    setInput("");
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            (res.status === 429
              ? "Too many messages. Wait a moment and try again."
              : "Could not send message.")
        );
        setMessages(messages);
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (hiddenRoute) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 sm:right-6 z-[70] bottom-[max(6rem,calc(1.5rem+env(safe-area-inset-bottom,0px)))] flex w-[min(100vw-2rem,380px)] max-h-[min(85dvh,640px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[0_24px_80px_rgba(0,0,0,0.55)] safe-x"
            role="dialog"
            aria-label="Nearby places assistant"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-surface">
              <div>
                <p className="text-sm font-semibold text-foreground">Nearby places</p>
                <p className="text-[0.65rem] text-muted font-coords tracking-wider uppercase">
                  From a place name
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-foreground rounded-full"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 max-h-[min(50vh,420px)] min-h-[240px] overflow-y-auto px-4 py-4 space-y-3"
            >
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-olive text-ink rounded-br-md"
                      : "mr-auto bg-muted-bg text-foreground border border-border rounded-bl-md whitespace-pre-wrap"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking…
                </div>
              )}
              {error && <p className="text-xs text-sunset">{error}</p>}
            </div>

            <form
              className="border-t border-border p-3 flex gap-2 bg-surface"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Place name or “near …”"
                disabled={sending}
                className="flex-1 adventure-pill border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-olive disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-olive text-ink disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "fixed right-4 sm:right-6 z-[70] bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] h-14 w-14 rounded-full shadow-lg flex items-center justify-center border safe-x",
          open
            ? "bg-surface border-border text-foreground"
            : "bg-olive border-olive text-ink"
        )}
        aria-label={open ? "Close nearby places" : "Open nearby places"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} strokeWidth={1.75} />}
      </motion.button>
    </>
  );
}
