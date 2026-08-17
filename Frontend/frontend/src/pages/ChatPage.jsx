import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import AppShell from "@/components/AppShell";
import {
  setConversations, setActiveId, setMessages,
  addLocalMessage, removeConversationLocal, addConversationLocal,
} from "@/store/conversationsSlice";
import { createConversation, listConversations, getMessages, deleteConversationApi } from "@/api/conversations";
import { askQuestion } from "@/api/chat";
import { uploadDocument, listDocuments, deleteDocument } from "@/api/documents";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { conversations, activeId, messages } = useSelector((s) => s.conversations);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [docError, setDocError] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initConversations();
    refreshDocuments();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function initConversations() {
    setLoadingConvos(true);
    try {
      const convos = await listConversations();
      dispatch(setConversations(convos));
      if (convos.length > 0) {
        await selectConversation(convos[0].id);
      } else {
        await handleNew();
      }
    } finally {
      setLoadingConvos(false);
    }
  }

  async function selectConversation(id) {
    dispatch(setActiveId(id));
    const msgs = await getMessages(id);
    dispatch(setMessages(msgs));
  }

  async function handleNew() {
    const convo = await createConversation();
    dispatch(addConversationLocal(convo));
    dispatch(setActiveId(convo.id));
    dispatch(setMessages([]));
  }

  async function handleDeleteConvo(id) {
    await deleteConversationApi(id);
    dispatch(removeConversationLocal(id));
  }

  async function refreshDocuments() {
    try {
      const data = await listDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setDocError(err.message);
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setDocError("");
    try {
      await uploadDocument(file);
      await refreshDocuments();
    } catch (err) {
      setDocError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDeleteDoc(filename) {
    try {
      await deleteDocument(filename);
      await refreshDocuments();
    } catch (err) {
      setDocError(err.message);
    }
  }

  async function handleSend(e) {
  e.preventDefault();
  if (!input.trim() || sending) return;

  let targetId = activeId;

  // No active conversation (e.g. all were deleted) — create one on the fly
  if (!targetId || !conversations.find((c) => c.id === targetId)) {
    const convo = await createConversation();
    dispatch(addConversationLocal(convo));
    dispatch(setActiveId(convo.id));
    dispatch(setMessages([]));
    targetId = convo.id;
  }

  const question = input;
  setInput("");
  dispatch(addLocalMessage({ role: "user", text: question }));

  setSending(true);
  try {
    const data = await askQuestion(targetId, question);
    dispatch(addLocalMessage({ role: "bot", text: data.answer }));
  } catch (err) {
    dispatch(addLocalMessage({ role: "bot", text: `Error: ${err.message}` }));
  } finally {
    setSending(false);
  }
}

  return (
    <AppShell title="Chat" subtitle="Ask anything">
      <div className="relative flex h-full">
        <aside className={`absolute inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-border bg-bg-panel p-4 transition-transform md:relative md:translate-x-0 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}>
          <button onClick={handleNew} className="mb-4 w-full rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            + New conversation
          </button>

          <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {loadingConvos ? (
              <p className="text-[12px] text-text-faint">Loading...</p>
            ) : (
              conversations.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="group relative">
                      <button
                        onClick={() => selectConversation(c.id)}
                        className={`w-full truncate rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                          activeId === c.id ? "bg-brand/10 text-brand font-medium" : "text-text-muted hover:bg-bg-muted"
                        }`}
                      >
                        {c.title}
                      </button>
                      <button
                        onClick={() => handleDeleteConvo(c.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-faint hover:text-error md:hidden md:group-hover:block"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </motion.div>
              ))
            )}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-text-faint">Documents</span>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-[12px] font-medium text-brand hover:underline disabled:opacity-50">
                {uploading ? "Uploading..." : "+ Upload"}
              </button>
              <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept=".pdf,.txt,.docx,.md" />
            </div>
            {docError && <p className="mb-2 text-[11px] text-error">{docError}</p>}
            <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
              {documents.length === 0 ? (
                <p className="text-[12px] text-text-faint">No documents yet</p>
              ) : (
                documents.map((name) => (
                  <div key={name} className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-[12px] text-text-muted hover:bg-bg-muted">
                    <span className="truncate">{name}</span>
                    <button onClick={() => handleDeleteDoc(name)} className="text-text-faint hover:text-error md:hidden md:group-hover:block" title="Delete">✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
        {sidebarOpen && (
  <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 z-30 bg-black/30 md:hidden" />
)}

        <div className="flex flex-1 flex-col">
          <button
            onClick={() => setSidebarOpen(true)}
            className="m-2 flex items-center gap-2 self-start rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted md:hidden"
          >
            ☰ Conversations
          </button>
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-text-faint">Start a conversation</div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div key={m.id || i} className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "ml-auto bg-brand text-white" : "mr-auto bg-bg-muted text-text-primary"}`}>
                    {m.role === "bot" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:text-text-primary prose-p:text-text-primary prose-li:text-text-primary prose-strong:text-text-primary">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    ) : m.text}
                  </div>
                ))}
                {sending && (
                  
                  <div className="mr-auto flex items-center gap-1 rounded-2xl bg-bg-muted px-4 py-2 text-sm text-text-faint">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse [animation-delay:0.15s]">●</span>
                    <span className="animate-pulse [animation-delay:0.3s]">●</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-4">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." disabled={sending}
              className="flex-1 rounded-lg border border-border bg-bg-page px-3 py-2 text-sm text-text-primary outline-none focus:border-brand disabled:opacity-60" />
            <button type="submit" disabled={sending} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
              {sending ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}