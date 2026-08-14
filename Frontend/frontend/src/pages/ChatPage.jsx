import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppShell from "@/components/AppShell";
import { newConversation, selectConversation, sendMessage, deleteConversation } from "@/store/conversationsSlice";
import { motion } from "framer-motion";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { conversations, activeId } = useSelector((s) => s.conversations);
  const [input, setInput] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    dispatch(sendMessage({ conversationId: activeId, text: input }));
    setInput("");
  }

  function handleNew() {
    dispatch(newConversation());
  }

  return (
    <AppShell title="Chat" subtitle="Ask anything">
      <div className="flex h-full">
        {/* Conversation list */}
        <aside className="w-64 shrink-0 border-r border-border p-4">
          <button
            onClick={handleNew}
            className="mb-4 w-full rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            + New conversation
          </button>
          <div className="flex flex-col gap-1">
    {conversations.map((c, i) => (
      <motion.div
        key={c.id}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.03 }}
        className="group relative"
      >
        <button
          onClick={() => dispatch(selectConversation(c.id))}
          className={`w-full truncate rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
            activeId === c.id
              ? "bg-brand/10 text-brand font-medium"
              : "text-text-muted hover:bg-bg-muted"
          }`}
        >
          {c.title}
        </button>
        <button
          onClick={() => dispatch(deleteConversation(c.id))}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 text-text-faint hover:text-error group-hover:block"
          title="Delete"
        >
          ✕
        </button>
      </motion.div>
  ))}
</div>
        </aside>

        {/* Chat window */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {!active || active.messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-text-faint">
                Start a conversation
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {active.messages.map((m, i) => (
                  <div
                    key={i}
                    className="ml-auto max-w-[70%] rounded-2xl bg-brand px-4 py-2 text-sm text-white"
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-border bg-bg-page px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}