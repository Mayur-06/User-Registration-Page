import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus,
  History,
  FolderKanban,
  HelpCircle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  ArrowUp,
  FileText,
  Eye,
  Code2,
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  Search,
  X,
  Trash2,
  Loader2,
  Database,
} from 'lucide-react';
import { Logo } from './Logo';
import { INITIAL_CONTEXT_FILES } from '../data/mockData';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ChatPage = ({
  user: propUser,
  onNavigate,
  onOpenUpgradeModal,
  onOpenAddContextModal,
  onSelectCitation,
  onOpenAuth,
}) => {
  const { user: authUser } = useAuth();
  const user = authUser || propUser;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Chat & Conversation state
  const [conversations, setConversations] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  // Indexed Backend Documents State
  const [backendDocuments, setBackendDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  // History search
  const [historySearch, setHistorySearch] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState(null);

  // Cache for conversation messages: conversationId -> messages array
  const [conversationMessages, setConversationMessages] = useState({});

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mainInputRef = useRef(null);

  const supportedMimeTypes = [
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
  ];

  const isSupportedFile = (file) => {
    if (!file) return false;
    const extension = (file.name || '').split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'txt', 'csv', 'docx', 'doc'];
    return (
      file.size > 0 &&
      (supportedMimeTypes.includes(file.type) || allowedExtensions.includes(extension || ''))
    );
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Load user's conversations from backend
  const loadConversations = useCallback(async () => {
    if (!user) return;
    setIsLoadingConversations(true);
    try {
      const convos = await api.conversations.list();
      setConversations(convos || []);
    } catch (err) {
      console.warn('Failed to load conversations from backend:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user]);

  // Load user's indexed documents from backend
  const loadDocuments = useCallback(async () => {
    if (!user) return;
    setIsLoadingDocuments(true);
    try {
      const res = await api.documents.list();
      if (res && Array.isArray(res.documents)) {
        setBackendDocuments(res.documents);
      }
    } catch (err) {
      console.warn('Failed to load documents from backend:', err);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
    loadDocuments();
  }, [loadConversations, loadDocuments]);

  // Lazily fetch conversation messages when search query changes
  useEffect(() => {
    if (!historySearch.trim()) return;
    setConversationMessages((prev) => {
      const updated = { ...prev };
      conversations.forEach((c) => {
        if (!updated[c.id]) {
          updated[c.id] = null; // mark as pending fetch
        }
      });
      return updated;
    });
  }, [historySearch, conversations]);

  // Fetch messages for conversations not yet loaded when searching
  useEffect(() => {
    conversations.forEach(async (c) => {
      if (!conversationMessages[c.id]) {
        try {
          const msgs = await api.conversations.getMessages(c.id);
          setConversationMessages((prev) => ({
            ...prev,
            [c.id]: msgs || [],
          }));
        } catch (err) {
          console.error('Failed to load conversation messages for search:', err);
          setConversationMessages((prev) => ({
            ...prev,
            [c.id]: [],
          }));
        }
      }
    });
  }, [conversations, conversationMessages]);

  // Load messages for a selected conversation
  const handleSelectConversation = async (conversationId) => {
    setCurrentSessionId(conversationId);
    setActiveTab('chat');
    setIsTyping(false);

    try {
      const rawMessages = await api.conversations.getMessages(conversationId);
      const formatted = (rawMessages || []).map((msg) => ({
        id: msg.id,
        sender: msg.role === 'user' ? 'user' : 'assistant',
        text: msg.text,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setMessages(formatted);
    } catch (err) {
      console.error('Failed to load conversation messages:', err);
    }
  };

  // Start new chat
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInputText('');
    setAttachedFiles([]);
    setActiveTab('chat');
    setTimeout(() => {
      mainInputRef.current?.focus();
    }, 50);
  };

  // Delete a conversation
  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    try {
      await api.conversations.delete(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (currentSessionId === conversationId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Delete an indexed document
  const handleDeleteDocument = async (filename) => {
    try {
      await api.documents.delete(filename);
      setBackendDocuments((prev) => prev.filter((d) => d !== filename));
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // Quick prompt cards
  const handleQuickPrompt = (type) => {
    let prompt = '';
    if (type === 'doc') {
      prompt = 'Analyze uploaded documents: Summarize key clauses, terms, and conditions accurately.';
    } else if (type === 'vision') {
      prompt = 'Inspect uploaded files: Extract chart trends and key metric datapoints.';
    } else if (type === 'code') {
      prompt = 'Write an optimized Python script for asynchronous PostgreSQL query execution.';
    } else {
      prompt = 'What documents are currently indexed in my knowledge base, and what topics do they cover?';
    }
    handleSendMessage(prompt);
  };

  // Send message to backend Gemini + RAG pipeline
  const handleSendMessage = async (customText) => {
    const textToSend = typeof customText === 'string' ? customText : inputText;
    if (!textToSend.trim()) return;

    if (!user) {
      if (onOpenAuth) onOpenAuth('signup');
      return;
    }

    let convoId = currentSessionId;

    // Create conversation on backend if not existing
    if (!convoId) {
      try {
        const titleSnippet = textToSend.slice(0, 35) + (textToSend.length > 35 ? '...' : '');
        const newConvo = await api.conversations.create(titleSnippet);
        convoId = newConvo.id;
        setCurrentSessionId(convoId);
        setConversations((prev) => [newConvo, ...prev]);
      } catch (err) {
        console.error('Could not create conversation:', err);
      }
    }

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Send question and conversation ID to backend FastAPI RAG endpoint
      const response = await api.chat.send(textToSend, convoId);

      const assistantMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.answer || 'I could not generate an answer for this query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Error connecting to RAG backend: ${err.message || 'Please check backend server status.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleFileUpload = async (e) => {
    const files = e?.target?.files || e?.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    fileInputRef.current.value = '';

    if (!user) {
      if (onOpenAuth) onOpenAuth('signup');
      return;
    }

    if (!isSupportedFile(file)) {
      setUploadFeedback({
        type: 'error',
        message:
          'This file type is not supported or it could not be read. Please upload a readable PDF, TXT, DOCX, or CSV file.',
      });
      return;
    }

    setUploadFeedback(null);
    setIsTyping(true);

    try {
      const res = await api.documents.upload(file);
      loadDocuments();

      const newFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'pdf',
        chunks: res.chunks,
      };

      setAttachedFiles((prev) => [...prev, newFile]);
    } catch (err) {
      console.error('Failed to upload document:', err);
      setUploadFeedback({
        type: 'error',
        message: err.message || 'This document could not be processed. Please try another readable file.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e);
  };

  const filteredConversations = conversations.filter((c) => {
    // Check title match
    const titleMatch = (c.title || '').toLowerCase().includes(historySearch.toLowerCase());
    
    // Check content match - fetch messages if not loaded yet
    const messages = conversationMessages[c.id];
    const hasMessages = !!messages;
    const contentMatch = !hasMessages
      ? false // will be re-checked after fetch completes
      : (messages.length > 0 && 
          messages.some((msg) => 
            (msg.text || '').toLowerCase().includes(historySearch.toLowerCase())
          ));
    
    return titleMatch || contentMatch;
  });

  return (
    <div
      className="h-screen w-screen bg-background text-on-background flex overflow-hidden font-sans"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.txt,.docx,.csv"
      />

      {/* Mobile Backdrop */}
      {!sidebarCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-25 transition-opacity"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* ===================== 1. LEFT SIDEBAR ===================== */}
      <aside
        className={`h-full bg-surface-container-low border-r border-outline-variant flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed
            ? 'w-[76px] max-md:w-0 max-md:overflow-hidden max-md:border-r-0'
            : 'w-64 sm:w-72 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-3.5">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <Logo size="sm" showText={true} />
                <span className="text-[9px] font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 w-fit shrink-0">
                  RAG
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 mb-4 pt-1">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 rounded-xl bg-[#0d1726] border border-[#1e293b] hover:border-[#38bdf8]/50 hover:bg-[#0f1e2d] transition-all cursor-pointer group flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.08)]"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <Logo size="sm" showText={false} withBadge={false} className="!shadow-none" />
              </button>
            </div>
          )}

          {/* New Chat Button
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#1e293b] bg-[#0e1928] text-[#f4f4f5] font-semibold hover:bg-[#15273e] hover:border-[#38bdf8]/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all cursor-pointer mb-3 ${
              sidebarCollapsed ? 'p-2.5' : 'px-4 py-2.5'
            }`}
            title="New Chat"
            aria-label="New Chat"
          >
            <Plus className="w-4 h-4 text-[#38bdf8]" />
            {!sidebarCollapsed && <span className="text-xs">New Chat</span>}
          </button>

          {/* Sidebar Nav Items */}
          {/* <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab(activeTab === 'history' ? 'chat' : 'history')}
              className={`w-full flex items-center gap-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#0d1726] text-[#38bdf8] border border-[#38bdf8]/30 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                  : 'text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] border border-transparent'
              } ${sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}`}
              title="Conversations"
              aria-label="Conversations"
            >
              <History className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Conversations ({conversations.length})</span>}
            </button>
          </nav>
        </div>

        {/* History Drawer */}
        {/* {!sidebarCollapsed && activeTab === 'history' && (
          <div className="flex-1 px-4 py-2 overflow-y-auto border-t border-b border-[#1e293b]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider font-mono">
                History
              </span>
              <span className="text-[10px] text-[#64748b] font-mono">{conversations.length} total</span>
            </div> */}
            {/* <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-[#050b14] border border-[#1e293b] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#38bdf8] font-sans"
              />
            </div>
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-6 text-xs text-[#94a3b8] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#64748b]">
                No conversations yet. Start a chat!
              </div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {filteredConversations.map((convo) => (
                  <div */}
                    {/* key={convo.id}
                    onClick={() => handleSelectConversation(convo.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer group ${
                      currentSessionId === convo.id
                        ? 'bg-[#0e1928] text-[#38bdf8] border border-[#38bdf8]/30'
                        : 'text-[#94a3b8] hover:bg-[#0e1928]/60 hover:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium truncate text-[#f4f4f5] group-hover:text-[#38bdf8]">
                        {convo.title || 'Untitled Conversation'}
                      </p>
                      <span className="text-[10px] text-[#64748b] font-mono">
                        {convo.created_at
                          ? new Date(convo.created_at).toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(e, convo.id)}
                      className="p-1 rounded text-[#64748b] hover:text-rose-400 hover:bg-[#1a0f14] transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3 h-3" />
            
        )} 

        {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#1e293b] bg-[#0e1928] text-[#f4f4f5] font-semibold hover:bg-[#15273e] hover:border-[#38bdf8]/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all cursor-pointer mt-6 mb-3 ${
              sidebarCollapsed ? 'p-2.5' : 'px-4 py-2.5'
            }`}
            title="New Chat"
            aria-label="New Chat"
          >
            <Plus className="w-4 h-4 text-[#38bdf8]" />
            {!sidebarCollapsed && <span className="text-xs">New Chat</span>}
          </button>

          {/* Sidebar Nav Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab(activeTab === 'history' ? 'chat' : 'history')}
              className={`w-full flex items-center gap-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#0d1726] text-[#38bdf8] border border-[#38bdf8]/30 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                  : 'text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] border border-transparent'
              } ${sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}`}
              title="Conversations"
              aria-label="Conversations"
            >
              <History className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Conversations ({conversations.length})</span>}
            </button>
          </nav>
        </div>

        {/* History Drawer */}
        {!sidebarCollapsed && activeTab === 'history' && (
          <div className="flex-1 px-4 py-2 overflow-y-auto border-t border-b border-[#1e293b]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider font-mono">
                History
              </span>
              <span className="text-[10px] text-[#64748b] font-mono">{conversations.length} total</span>
            </div>
            <div className="relative mb-3">
              {/* <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" /> */}
              <input
                type="text"
                placeholder="Search conversations..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-[#050b14] border border-[#1e293b] rounded-lg pl-9 pr-2.5 py-1.5 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#38bdf8] font-sans"
              />
            </div>
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-6 text-xs text-[#94a3b8] gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#64748b]">
                No conversations yet. Start a chat!
              </div>
            ) : (
              <div className="space-y-1 pr-1">
                {filteredConversations.map((convo) => (
                  <div
                    key={convo.id}
                    onClick={() => handleSelectConversation(convo.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer group ${
                      currentSessionId === convo.id
                        ? 'bg-[#0e1928] text-[#38bdf8] border border-[#38bdf8]/30'
                        : 'text-[#94a3b8] hover:bg-[#0e1928]/60 hover:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium truncate text-[#f4f4f5] group-hover:text-[#38bdf8]">
                        {convo.title || 'Untitled Conversation'}
                      </p>
                      <span className="text-[10px] text-[#64748b] font-mono">
                        {convo.created_at
                          ? new Date(convo.created_at).toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(e, convo.id)}
                      className="p-1 rounded text-[#64748b] hover:text-rose-400 hover:bg-[#1a0f14] transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* Bottom Sidebar: Documents, Upgrade to Pro & Settings */}
        <div className="flex flex-col border-t border-[#1e293b] h-0 flex-1 overflow-hidden">
          {/* Documents Section (Scrollable) */}
          {!sidebarCollapsed && (
            <div className="flex-1 min-h-0 overflow-y-auto border-b border-[#1e293b]">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider font-mono">
                    Documents
                  </span>
                  <span className="text-[10px] text-[#64748b] font-mono">{backendDocuments.length}</span>
                </div>

                {isLoadingDocuments ? (
                  <div className="flex items-center gap-2 text-xs text-[#94a3b8] py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
                    <span>Loading documents...</span>
                  </div>
                ) : backendDocuments.length === 0 ? (
                  <div className="text-[11px] text-[#64748b] py-2">No uploaded documents yet.</div>
                ) : (
                  <div className="space-y-1.5">
                    {backendDocuments.map((doc, index) => (
                      <div
                        key={`${doc}-${index}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-[#0b1220] border border-[#1e293b] px-2.5 py-1.5 text-[11px] text-[#e2e8f0]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                          <span className="truncate">{doc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc)}
                          className="text-[#64748b] hover:text-rose-400 transition-colors cursor-pointer p-1 rounded"
                          title={`Delete ${doc}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons Section (Fixed at Bottom) */}
          <div className="p-3.5 space-y-2.5 shrink-0">
            {/* {!sidebarCollapsed ? (
              <button
                onClick={onOpenUpgradeModal}
                className="w-full py-2.5 rounded-xl bg-[#38bdf8] text-slate-950 font-bold text-xs hover:bg-[#38bdf8]/90 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#38bdf8]/50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Pro</span>
              </button>
            ) : (
              <button
                onClick={onOpenUpgradeModal}
                className="w-full p-2.5 rounded-xl bg-[#38bdf8] text-slate-950 font-bold hover:bg-[#38bdf8]/90 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.3)] border border-[#38bdf8]/50"
                title="Upgrade to Pro"
                aria-label="Upgrade to Pro"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )} */}

            <div className="space-y-1.5">
              {/* <button
                onClick={() => onNavigate('docs')}
                className={`w-full flex items-center gap-3 rounded-lg text-xs text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] transition-colors cursor-pointer border border-transparent hover:border-[#1e293b] ${
                  sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                }`}
                title="Help & Support"
                aria-label="Help & Support"
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Help & Support</span>}
              </button> */}

              <button
                onClick={() => onNavigate('profile')}
                className={`w-full flex items-center gap-3 rounded-lg text-xs text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] transition-colors cursor-pointer border border-transparent hover:border-[#1e293b] ${
                  sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                }`}
                title="Settings & Profile"
                aria-label="Settings & Profile"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ===================== 2. MAIN CHAT AREA ===================== */}
      <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-outline-variant bg-surface-container-low/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#0e1928] border border-[#1e293b] hover:border-[#38bdf8]/40 transition-all cursor-pointer flex items-center justify-center"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#94a3b8] hover:text-[#38bdf8] transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <span>← Back to Home</span>
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/60 transition-all cursor-pointer"
                title="View Profile"
              >
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover border border-[#38bdf8]/40"
                />
                <span className="text-xs font-medium text-[#f4f4f5] hidden sm:inline">
                  {user?.name?.split(' ')[0] || 'Profile'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="px-3 py-1.5 rounded-lg bg-[#38bdf8] text-slate-950 text-xs font-bold hover:bg-[#38bdf8]/90 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Chat Stream Area */}
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          {messages.length === 0 ? (
            <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto text-center animate-in fade-in duration-300">
              <div
                className="mb-6 relative group cursor-pointer shrink-0"
                onClick={() => handleQuickPrompt('doc')}
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-[#38bdf8]/20 via-[#0ea5e9]/20 to-[#818cf8]/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Logo size="lg" showText={false} />
              </div>

              <h1
                className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2.5 text-[#f4f4f5]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                How can I assist you today?
              </h1>

              <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md mx-auto mb-8 leading-relaxed font-sans">
                Ask questions across uploaded documents, run reasoning queries, or test vector grounding.
              </p>

              {/* Conversational Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left mb-6">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('doc')}
                  className="p-3.5 rounded-xl bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/60 hover:bg-[#091424] transition-all duration-200 group cursor-pointer text-left shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#38bdf8] transition-colors">
                      Document Synthesis
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Query FAISS vectors and extract insights from your uploaded PDFs
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt('vision')}
                  className="p-3.5 rounded-xl bg-[#08101d] border border-[#1e293b] hover:border-[#818cf8]/60 hover:bg-[#091424] transition-all duration-200 group cursor-pointer text-left shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#818cf8]" />
                    <span className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#818cf8] transition-colors">
                      Document Querying
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Verify citation claims and check specific data points in documents
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt('code')}
                  className="p-3.5 rounded-xl bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/60 hover:bg-[#091424] transition-all duration-200 group cursor-pointer text-left shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#38bdf8] transition-colors">
                      Code & Engineering
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Generate optimized backend code, algorithms, and SQL queries
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt('reasoning')}
                  className="p-3.5 rounded-xl bg-[#08101d] border border-[#1e293b] hover:border-[#818cf8]/60 hover:bg-[#091424] transition-all duration-200 group cursor-pointer text-left shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#818cf8]" />
                    <span className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#818cf8] transition-colors">
                      Check Indexed Context
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">
                    Review which documents are indexed and ready for semantic search
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full pb-8">
              {messages.map((msg, msgIdx) => (
                <div
                  key={msg.id || `msg-${msgIdx}-${msg.timestamp}`}
                  className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="shrink-0 mt-1">
                      <Logo size="sm" showText={false} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all ${
                      msg.sender === 'user'
                        ? 'bg-[#0e1928] border-[#1e293b] text-[#f4f4f5] rounded-tr-sm shadow-md'
                        : 'bg-[#08101d] border-[#1e293b] text-[#f4f4f5] rounded-tl-sm shadow-xl'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#1e293b]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#f4f4f5]">LucyChat Gemini AI</span>
                          <span className="text-[10px] font-mono text-[#64748b]">{msg.timestamp}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="p-1 rounded text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#0e1928] transition-colors cursor-pointer"
                          title="Copy text"
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3 font-sans">
                      {msg.text}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="shrink-0 mt-1">
                      <img
                        src={
                          user?.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                        }
                        alt="User"
                        className="w-7 h-7 rounded-full object-cover border border-[#1e293b]"
                      />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3.5 items-center">
                  <Logo size="sm" showText={false} />
                  <div className="px-4 py-3 rounded-2xl bg-[#08101d] border border-[#1e293b] flex items-center gap-2.5 shadow-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-xs font-mono text-[#38bdf8]">
                      Searching FAISS vectors & reasoning with Lucy...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Bottom Input Bar */}
        <div className="shrink-0 w-full bg-[#050b14] border-t border-[#1e293b] p-3.5 sm:p-5">
          <div className="max-w-4xl mx-auto w-full">
            {uploadFeedback && (
              <div className="mb-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200">
                {uploadFeedback.message}
              </div>
            )}

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 px-1">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#08101d] border border-[#38bdf8]/40 text-xs text-[#f4f4f5]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="font-mono text-xs">{file.name}</span>
                    <button
                      onClick={() => setAttachedFiles((prev) => prev.filter((f) => f.id !== file.id))}
                      className="text-[#94a3b8] hover:text-rose-400 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-[#08101d] rounded-2xl border border-[#1e293b] p-2 focus-within:border-[#38bdf8] focus-within:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all duration-300 shadow-xl"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#0e1928] transition-colors cursor-pointer"
                title="Attach PDF or document to index into RAG"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                ref={mainInputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  user
                    ? 'Ask anything or query indexed documents...'
                    : 'Sign in to start chatting with Gemini & your documents...'
                }
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[#f4f4f5] placeholder-[#64748b] focus:outline-none font-sans"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-[#38bdf8] text-slate-950 flex items-center justify-center font-bold hover:bg-[#38bdf8]/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
