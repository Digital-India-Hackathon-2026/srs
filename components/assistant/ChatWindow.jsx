"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, Minus, RotateCcw, Trash2, X, Search } from "lucide-react";
import QuickChips, { QUICK_CHIPS, SERVICE_SUGGESTIONS, EXAMPLE_QUESTIONS } from "./QuickChips";
import VoiceInput from "./VoiceInput";

// ── Language detection (client-side mirror of server) ─────────────────────────
const TE_ROMAN = ["ela","cheyali","kavali","ekkada","enti","emiti","entha","enni","rojulu","marchali","update cheyali","documents enti","fee entha"];
const HI_ROMAN = ["kaise","kare","karna","batao","chahiye","kahan","kya","kitna","kitne","din","milega","hota","process kya","fees kitni"];

function detectLang(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const lower = text.toLowerCase();
  if (TE_ROMAN.some(w => lower.includes(w))) return "te";
  if (HI_ROMAN.some(w => lower.includes(w))) return "hi";
  return "en";
}

const UI_LABELS = {
  en: { placeholder: "Ask anything about Telangana services", listening: "Listening...", typing: "SevaSetu AI is typing...", error: "Connection error. Please try again." },
  te: { placeholder: "తెలంగాణ సేవల గురించి ఏదైనా అడగండి", listening: "వింటున్నాను...", typing: "సేవాసేతు AI సమాధానం సిద్ధం చేస్తోంది...", error: "కనెక్షన్ సమస్య. మళ్లీ ప్రయత్నించండి." },
  hi: { placeholder: "तेलंगाना सेवाओं के बारे में कुछ भी पूछें", listening: "सुन रहा हूँ...", typing: "सेवासेतु AI उत्तर तैयार कर रहा है...", error: "कनेक्शन एरर। कृपया दोबारा प्रयास करें।" },
};

// ── Format AI response text into structured JSX ───────────────────────────────
function FormattedMessage({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];

  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="space-y-1 my-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-[#163A63] mt-0.5 flex-shrink-0 text-[10px]">▸</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) { flushList(i); return; }

    if (/^(\d+[.)]\s|Step \d+)/.test(trimmed)) {
      flushList(i);
      const content = trimmed.replace(/^(\d+[.)]\s*|Step \d+\s*[—–-]\s*)/i, "");
      const num = trimmed.match(/^\d+/)?.[0];
      elements.push(
        <div key={i} className="flex items-start gap-1.5 my-1">
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#163A63] text-white text-[9px] flex items-center justify-center mt-0.5">{num}</span>
          <span className="leading-relaxed text-[12.5px]">{content}</span>
        </div>
      );
      return;
    }

    if (/^[•\-\*]\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[•\-\*]\s+/, ""));
      return;
    }

    if (/^[\u{1F000}-\u{1FFFF}📄🏛👤📑💰⏳📝⚠🔗📍☎🌐🔒✅❌⚡🔑]/u.test(trimmed)) {
      flushList(i);
      elements.push(<div key={i} className="font-semibold text-[#163A63] text-[12.5px] mt-2 mb-0.5 leading-snug">{trimmed}</div>);
      return;
    }

    if ((trimmed.endsWith(":") && trimmed.length < 60) || /^[A-Z\s]{8,40}$/.test(trimmed)) {
      flushList(i);
      elements.push(<div key={i} className="font-semibold text-[11px] text-gray-600 uppercase tracking-wide mt-2 mb-0.5">{trimmed.replace(/:$/, "")}</div>);
      return;
    }

    if (/official portal:/i.test(trimmed)) {
      flushList(i);
      const urlMatch = trimmed.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        elements.push(
          <a key={i} href={urlMatch[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 mt-1.5 underline">
            🔗 Official Portal ↗
          </a>
        );
      } else {
        elements.push(<p key={i} className="text-[12.5px] leading-relaxed mt-0.5">{trimmed}</p>);
      }
      return;
    }

    flushList(i);
    elements.push(<p key={i} className="text-[12.5px] leading-relaxed mt-0.5">{trimmed}</p>);
  });

  flushList("final");
  return <div className="space-y-0.5">{elements}</div>;
}

// ── TTS helper ────────────────────────────────────────────────────────────────
function speakText(text, lang = "en") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  // Clean text for speech — remove URLs, emojis, markdown
  const cleaned = text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*#_`>]/g, "")
    .replace(/[🔗📄🏛👤📑💰⏳📝⚠📍☎✅❌⚡🔑🔊🔴▸•]/g, "")
    .replace(/Official portal:?\s*/gi, "")
    .replace(/Source:.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);

  if (!cleaned) return;

  const langCode = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const utter = new SpeechSynthesisUtterance(cleaned);
  utter.lang = langCode;
  utter.rate = 0.92;
  utter.pitch = 1;
  utter.volume = 1;

  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchVoice = voices.find(v => v.lang === langCode)
    || voices.find(v => v.lang.startsWith(lang))
    || null;
  if (matchVoice) utter.voice = matchVoice;

  window.speechSynthesis.speak(utter);
}

// Ensure voices are loaded
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}

// ── Main ChatWindow ───────────────────────────────────────────────────────────
export default function ChatWindow({ onMinimize, onClose, onStateChange }) {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [service, setService]     = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [ttsEnabled, setTtsEnabled]     = useState(false);
  const [searchMode, setSearchMode]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeLang, setActiveLang]     = useState("en"); // tracks conversation language
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const searchRef = useRef(null);
  const spokenIds = useRef(new Set());

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);
  useEffect(() => { if (searchMode) setTimeout(() => searchRef.current?.focus(), 100); }, [searchMode]);

  const labels = UI_LABELS[activeLang] || UI_LABELS.en;

  const sendMessage = useCallback(async (text) => {
    const rawQ = (text || input).trim();
    if (!rawQ || loading) return;

    const lang = detectLang(rawQ);
    setActiveLang(lang); // update conversation language

    // Build conversation history (last 6 messages = 3 Q&A pairs)
    const history = messages.slice(-6).map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    setInput("");
    setLastQuestion(rawQ);
    setMessages(prev => [...prev, { role: "user", text: rawQ, id: Date.now() }]);
    setLoading(true);
    if (onStateChange) onStateChange("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawQ,
          serviceId: service || undefined,
          lang,
          selectedLanguage: lang,
          previousLanguage: activeLang,
          history,
        }),
      });
      const data = await res.json();
      const meta = data.metadata || {};

      if (meta.service && !service) setService(meta.service);
      if (meta.detectedLanguage) setActiveLang(meta.detectedLanguage);

      const answer = data.answer || (UI_LABELS[lang] || UI_LABELS.en).error;
      const msgId = Date.now() + 1;

      setMessages(prev => [...prev, {
        role: "assistant",
        text: answer,
        officialSource: meta.officialSource || null,
        id: msgId,
        lang: meta.detectedLanguage || lang,
      }]);

      // Auto-speak if enabled
      if (ttsEnabled && !spokenIds.current.has(msgId)) {
        spokenIds.current.add(msgId);
        speakText(answer, meta.detectedLanguage || lang);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: labels.error, isError: true, id: Date.now() + 2 }]);
    } finally {
      setLoading(false);
      if (onStateChange) { onStateChange("happy"); setTimeout(() => onStateChange("idle"), 2000); }
    }
  }, [input, loading, service, messages, ttsEnabled, onStateChange, activeLang, labels.error]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function clearChat() {
    setMessages([]); setService(""); setLastQuestion("");
    setSearchMode(false); setSearchQuery("");
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    inputRef.current?.focus();
  }

  function handleServiceSelect(id) {
    setService(id); setSearchMode(false); setSearchQuery("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const filteredChips = searchQuery.trim()
    ? QUICK_CHIPS.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : QUICK_CHIPS;

  const isEmpty    = messages.length === 0;
  const suggestions = service && SERVICE_SUGGESTIONS[service] ? SERVICE_SUGGESTIONS[service] : null;
  const exampleQs   = service && EXAMPLE_QUESTIONS[service]   ? EXAMPLE_QUESTIONS[service]   : null;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#163A63] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image src="/images/sevasetu-logo.png" alt="" width={22} height={22} className="object-contain" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">SevaSetu AI</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-white/60">
                {service ? service.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Telangana Gov. Services"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => { setSearchMode(s => !s); setSearchQuery(""); }}
            className={`p-1.5 rounded-md transition-colors ${searchMode ? "text-white bg-white/20" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            aria-label="Search services" title="Search services"
          >
            <Search size={13} />
          </button>
          {messages.length > 0 && (
            <button onClick={clearChat} className="p-1.5 text-white/60 hover:text-white rounded-md hover:bg-white/10 transition-colors" aria-label="Clear chat" title="New chat">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={onMinimize} className="p-1.5 text-white/60 hover:text-white rounded-md hover:bg-white/10 transition-colors" aria-label="Minimize" title="Minimize">
            <Minus size={13} />
          </button>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white rounded-md hover:bg-white/10 transition-colors" aria-label="Close" title="Close">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Search panel */}
      {searchMode && (
        <div className="px-3 py-2 bg-[#f0f4f9] border-b border-gray-100 flex-shrink-0">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search services (e.g. passport, aadhaar, income...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-[11px] bg-white border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-[#163A63] transition-colors"
            aria-label="Search services"
          />
          {searchQuery && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filteredChips.length > 0 ? filteredChips.map(chip => (
                <button key={chip.id} onClick={() => handleServiceSelect(chip.id)}
                  className="text-[10px] bg-white border border-[#163A63]/30 text-[#163A63] px-2.5 py-1 rounded-full hover:bg-[#163A63] hover:text-white transition-all font-medium">
                  {chip.label}
                </button>
              )) : (
                <span className="text-[10px] text-gray-400">No services found for &ldquo;{searchQuery}&rdquo;</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Service chips */}
      <QuickChips selectedService={service} onSelectService={handleServiceSelect} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">

        {/* Empty state */}
        {isEmpty && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center shadow-lg mb-3 overflow-hidden">
              <Image src="/images/sevasetu-logo.png" alt="" width={40} height={40} className="object-contain w-10 h-10" />
            </div>
            <h3 className="text-sm font-bold text-[#163A63] mb-1">
              {service ? `Ask about ${service.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}` : "Hi! I'm SevaSetu AI 👋"}
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed max-w-[250px] mb-3">
              {service ? "Tap a topic below or type your question." : "Your AI guide for Telangana Government Services."}
            </p>

            {suggestions && (
              <div className="flex flex-wrap gap-1.5 justify-center max-w-[300px]">
                {suggestions.slice(0, 6).map(s => (
                  <button key={s.label} onClick={() => sendMessage(s.question)}
                    className="text-[10px] bg-[#f0f4f9] border border-[#163A63]/20 text-[#163A63] px-2 py-1 rounded-full hover:bg-[#163A63] hover:text-white transition-all font-medium">
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {!service && (
              <div className="flex flex-wrap gap-1.5 justify-center max-w-[280px]">
                {["What documents for passport?", "Income certificate fee?", "Aadhaar address update", "Driving licence steps"].map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-[10px] bg-[#f0f4f9] border border-[#163A63]/20 text-[#163A63] px-2 py-1 rounded-full hover:bg-[#163A63] hover:text-white transition-all font-medium">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {service && !suggestions && exampleQs && (
              <div className="flex flex-col gap-1.5 w-full max-w-[290px] mt-1">
                {exampleQs.slice(0, 4).map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-left text-[10px] text-[#163A63] bg-[#f0f4f9] border border-[#163A63]/10 rounded-lg px-2.5 py-1.5 hover:border-[#163A63]/40 hover:bg-[#e8eef6] transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex mb-3 msg-fade ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center flex-shrink-0 mt-0.5 mr-1.5 shadow-sm overflow-hidden">
                <Image src="/images/sevasetu-logo.png" alt="" width={18} height={18} className="object-contain" />
              </div>
            )}
            <div className="max-w-[85%]">
              <div className={`px-3 py-2 text-[12.5px] ${
                msg.role === "user"
                  ? "bg-[#163A63] text-white rounded-2xl rounded-br-sm shadow-sm"
                  : msg.isError
                  ? "bg-red-50 text-red-700 rounded-2xl rounded-bl-sm border border-red-100"
                  : "bg-gray-50 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
              }`}>
                {msg.role === "user"
                  ? <span className="leading-relaxed whitespace-pre-wrap">{msg.text}</span>
                  : <FormattedMessage text={msg.text} />
                }
              </div>
              {msg.officialSource && msg.role === "assistant" && (
                <a href={msg.officialSource} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 ml-1 text-[10px] text-blue-500 hover:text-blue-700 transition-colors">
                  🔗 Official portal ↗
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Follow-up suggestions after each AI reply */}
        {!loading && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && suggestions && (
          <div className="ml-8 mb-2 flex flex-wrap gap-1.5">
            {suggestions.slice(0, 4).map(s => (
              <button key={s.label} onClick={() => sendMessage(s.question)}
                className="text-[10px] bg-white border border-[#163A63]/20 text-[#163A63] px-2 py-0.5 rounded-full hover:bg-[#163A63] hover:text-white transition-all font-medium shadow-sm">
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Thinking */}
        {loading && (
          <div className="flex mb-3 justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center flex-shrink-0 mt-0.5 mr-1.5 shadow-sm overflow-hidden">
              <Image src="/images/sevasetu-logo.png" alt="" width={18} height={18} className="object-contain" />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#163A63] rounded-full animate-bounce opacity-70" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-[#163A63] rounded-full animate-bounce opacity-70" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-[#163A63] rounded-full animate-bounce opacity-70" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Retry */}
        {!loading && messages.length > 0 && messages[messages.length - 1]?.isError && (
          <div className="flex justify-start ml-8 mb-2">
            <button onClick={() => lastQuestion && sendMessage(lastQuestion)}
              className="flex items-center gap-1 text-xs text-[#163A63] font-medium hover:text-[#C89A2B] transition-colors">
              <RotateCcw size={10} /> Try again
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1.5 flex-shrink-0 bg-white border-t border-gray-100">
        <div className="flex items-end gap-1.5 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-[#163A63] focus-within:ring-1 focus-within:ring-[#163A63]/15 transition-all shadow-sm">
          <textarea
            ref={inputRef}
            rows={1}
            className="flex-1 bg-transparent text-[12.5px] text-gray-800 outline-none resize-none leading-relaxed placeholder:text-gray-400 min-w-0"
            placeholder={service ? `Ask about ${service.replace(/-/g, " ")}…` : labels.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: "20px", maxHeight: "72px" }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 72) + "px"; }}
            aria-label="Chat input"
          />
          <VoiceInput
            onTranscript={text => { setInput(prev => prev ? `${prev} ${text}` : text); setTimeout(() => inputRef.current?.focus(), 100); }}
            disabled={loading}
            ttsEnabled={ttsEnabled}
            onTtsToggle={() => setTtsEnabled(v => !v)}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-7 h-7 bg-[#163A63] hover:bg-[#1a4a7a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
            aria-label="Send message"
          >
            <ArrowUp size={13} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-[9px] text-gray-300 mt-1.5">SevaSetu AI • Verified government information only</p>
      </div>
    </div>
  );
}
