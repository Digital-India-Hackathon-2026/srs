"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, Minus, RotateCcw, Trash2, X } from "lucide-react";
import { getQuickQuestions, DEFAULT_QUESTIONS } from "../../lib/quickQuestions";
import { useLanguage } from "../../context/LanguageContext";

const SERVICE_CHIPS = [
  { id: "passport", label: "Passport" },
  { id: "income-certificate", label: "Income Cert" },
  { id: "driving-licence", label: "Driving Licence" },
  { id: "aadhaar-update", label: "Aadhaar" },
  { id: "birth-certificate", label: "Birth Cert" },
  { id: "caste-certificate", label: "Caste Cert" },
  { id: "ration-card", label: "Ration Card" },
  { id: "pan-card", label: "PAN" },
  { id: "voter-id", label: "Voter ID" },
];

export default function ChatWindow({ onMinimize, onClose, onStateChange }) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);

  const quickQuestions = service ? getQuickQuestions(service) : DEFAULT_QUESTIONS;

  async function sendMessage(text) {
    const q = (text || input).trim();
    if (!q || loading) return;

    setInput("");
    setLastQuestion(q);
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    if (onStateChange) onStateChange("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, serviceId: service || undefined, lang: language }),
      });
      const data = await res.json();
      const meta = data.metadata || {};
      if (meta.service && !service) setService(meta.service);

      setMessages(prev => [...prev, {
        role: "assistant",
        text: data.answer || "I don't have verified information for this yet.",
        officialSource: meta.officialSource || null,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please try again.", isError: true }]);
    } finally {
      setLoading(false);
      if (onStateChange) { onStateChange("happy"); setTimeout(() => onStateChange("idle"), 2000); }
    }
  }

  function handleKeyDown(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }
  function handleRetry() { if (lastQuestion) sendMessage(lastQuestion); }
  function clearChat() { setMessages([]); setService(""); setLastQuestion(""); inputRef.current?.focus(); }
  function selectService(id) { setService(id); inputRef.current?.focus(); }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center shadow-sm overflow-hidden">
            <Image src="/images/sevasetu-logo.png" alt="" width={24} height={24} className="object-contain w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#163A63]">SevaSetu AI</span>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="text-[10px] text-gray-400">Online</span></div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {messages.length > 0 && <button onClick={clearChat} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" title="New chat"><Trash2 size={14} /></button>}
          <button onClick={onMinimize} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" title="Minimize"><Minus size={14} /></button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50" title="Close"><X size={14} /></button>
        </div>
      </div>

      {/* Service selector chips */}
      <div className="px-3 py-2 border-b border-gray-50 overflow-x-auto flex gap-1.5 flex-shrink-0 scrollbar-hide">
        {SERVICE_CHIPS.map(s => (
          <button key={s.id} onClick={() => selectService(s.id)} className={`text-[10px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap transition-all ${service === s.id ? "bg-[#163A63] text-white border-[#163A63]" : "bg-white text-gray-500 border-gray-200 hover:border-[#163A63] hover:text-[#163A63]"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {/* Empty state */}
        {isEmpty && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center shadow-lg mb-3 overflow-hidden">
              <Image src="/images/sevasetu-logo.png" alt="" width={40} height={40} className="object-contain w-10 h-10" />
            </div>
            <h3 className="text-sm font-bold text-[#163A63] mb-1">{t("helpDesk.greeting")}</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[240px] mb-4">
              {service ? `${t("helpDesk.subtitle")}` : t("helpDesk.description")}
            </p>

            {/* Dynamic quick questions */}
            <div className="w-full space-y-1.5">
              {quickQuestions.slice(0, 5).map(q => (
                <button key={q.text} onClick={() => sendMessage(q.text)} disabled={loading} className="w-full text-left text-[11px] text-[#163A63] bg-[#f0f4f9] hover:bg-[#e0e8f4] border border-[#163A63]/10 rounded-lg px-3 py-2 transition-colors disabled:opacity-50">
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2 shadow-sm overflow-hidden">
                <Image src="/images/sevasetu-logo.png" alt="" width={20} height={20} className="object-contain w-5 h-5" />
              </div>
            )}
            <div className="max-w-[80%]">
              <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-[#163A63] text-white rounded-2xl rounded-br-sm shadow-sm" : msg.isError ? "bg-red-50 text-red-700 rounded-2xl rounded-bl-sm border border-red-100" : "bg-gray-50 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"}`}>
                {msg.text}
              </div>
              {msg.officialSource && msg.role === "assistant" && (
                <a href={msg.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#163A63] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Visit Official Source
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex mb-4 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2 shadow-sm overflow-hidden">
              <Image src="/images/sevasetu-logo.png" alt="" width={20} height={20} className="object-contain w-5 h-5" />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#163A63] rounded-full animate-bounce opacity-70" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-[#163A63] rounded-full animate-bounce opacity-70" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-[#163A63] rounded-full animate-bounce opacity-70" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Retry */}
        {!loading && messages.length > 0 && messages[messages.length - 1]?.isError && (
          <div className="flex justify-start ml-9 mb-2">
            <button onClick={handleRetry} className="flex items-center gap-1 text-xs text-[#163A63] font-medium hover:text-[#C89A2B]"><RotateCcw size={11} /> Try again</button>
          </div>
        )}

        {/* Quick questions after messages (when service is selected) */}
        {!isEmpty && !loading && service && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {quickQuestions.slice(0, 4).map(q => (
              <button key={q.text} onClick={() => sendMessage(q.text)} className="text-[10px] text-[#163A63] bg-[#f0f4f9] hover:bg-[#e0e8f4] border border-[#163A63]/10 rounded-full px-2.5 py-1 transition-colors">
                {q.text.length > 30 ? q.text.substring(0, 28) + "..." : q.text}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 bg-white">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 focus-within:border-[#163A63] focus-within:ring-1 focus-within:ring-[#163A63]/20 transition-all shadow-sm">
          <textarea ref={inputRef} rows={1} className="flex-1 bg-transparent text-sm text-gray-800 outline-none resize-none leading-relaxed placeholder:text-gray-400" placeholder={t("helpDesk.placeholder")} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} style={{ minHeight: "22px", maxHeight: "80px" }} onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px"; }} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="w-7 h-7 bg-[#163A63] hover:bg-[#1a4a7a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-sm" aria-label="Send">
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">{t("helpDesk.verified")}</p>
      </div>
    </div>
  );
}
