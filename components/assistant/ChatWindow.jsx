"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUp,
  Minus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

export default function ChatWindow({ onMinimize, onClose, onStateChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  async function sendMessage(text) {
    const q = (text || input).trim();
    if (!q || loading) return;

    setInput("");
    setLastQuestion(q);
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);
    if (onStateChange) onStateChange("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, serviceId: service || undefined, lang: "en" }),
      });
      const data = await res.json();
      const meta = data.metadata || {};

      // Auto-detect service from response
      if (meta.service && !service) setService(meta.service);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "I don't have verified information for this yet. Please check the official portal.",
          officialSource: meta.officialSource || null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Please try again.", isError: true },
      ]);
    } finally {
      setLoading(false);
      if (onStateChange) {
        onStateChange("happy");
        setTimeout(() => onStateChange("idle"), 2000);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleRetry() {
    if (lastQuestion) sendMessage(lastQuestion);
  }

  function clearChat() {
    setMessages([]);
    setService("");
    setLastQuestion("");
    inputRef.current?.focus();
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center shadow-sm overflow-hidden">
            <Image src="/images/sevasetu-logo.png" alt="" width={24} height={24} className="object-contain w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#163A63]">SevaSetu AI</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-[10px] text-gray-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {messages.length > 0 && (
            <button onClick={clearChat} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors" title="New chat" aria-label="Clear chat">
              <Trash2 size={14} />
            </button>
          )}
          <button onClick={onMinimize} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors" title="Minimize" aria-label="Minimize">
            <Minus size={14} />
          </button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors" title="Close" aria-label="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">

        {/* Empty state — clean welcome */}
        {isEmpty && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center shadow-lg mb-4 overflow-hidden">
              <Image src="/images/sevasetu-logo.png" alt="" width={44} height={44} className="object-contain w-11 h-11" />
            </div>
            <h3 className="text-base font-bold text-[#163A63] mb-1">Hi! I'm SevaSetu AI 👋</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[260px]">
              I'm here to help you with Telangana Government Services.
            </p>
            <p className="text-xs text-gray-400 mt-2 max-w-[240px]">
              Ask me anything about Passport, Aadhaar, Driving Licence, MeeSeva, Income Certificate and more.
            </p>
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
            <div className={`max-w-[80%] ${msg.role === "user" ? "" : ""}`}>
              <div
                className={`px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#163A63] text-white rounded-2xl rounded-br-sm shadow-sm"
                    : msg.isError
                    ? "bg-red-50 text-red-700 rounded-2xl rounded-bl-sm border border-red-100"
                    : "bg-gray-50 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
              {msg.officialSource && msg.role === "assistant" && (
                <a href={msg.officialSource} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 ml-1 text-[10px] text-blue-500 hover:text-blue-700 transition-colors">
                  Official portal ↗
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Thinking animation */}
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
            <button onClick={handleRetry} className="flex items-center gap-1 text-xs text-[#163A63] font-medium hover:text-[#C89A2B] transition-colors">
              <RotateCcw size={11} /> Try again
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 bg-white">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 focus-within:border-[#163A63] focus-within:ring-1 focus-within:ring-[#163A63]/20 transition-all shadow-sm">
          <textarea
            ref={inputRef}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none resize-none leading-relaxed placeholder:text-gray-400"
            placeholder="Ask anything about Telangana Government Services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: "22px", maxHeight: "80px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-7 h-7 bg-[#163A63] hover:bg-[#1a4a7a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
            aria-label="Send"
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">
          SevaSetu AI • Verified government information only
        </p>
      </div>
    </div>
  );
}
