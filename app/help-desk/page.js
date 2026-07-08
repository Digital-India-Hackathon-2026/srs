"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bot, HelpCircle, Info, Send, ShieldCheck } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { activeServices } from "../../lib/telanganaServices";

function HelpDeskContent() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") || activeServices[0]?.id || "income-certificate";

  const [serviceId, setServiceId] = useState(preselected);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const param = searchParams.get("service");
    if (param) setServiceId(param);
  }, [searchParams]);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    const q = question.trim();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, serviceId, lang: "en" }),
      });
      const data = await res.json();
      const ans = data.answer || "This information is not verified yet. Please check the official Telangana portal or visit nearest MeeSeva center.";
      setAnswer(ans);
      setHistory((prev) => [{ q, ans, serviceId }, ...prev].slice(0, 5));
      setQuestion("");
    } catch {
      const fallback = "This information is not verified yet. Please check the official Telangana portal or visit nearest MeeSeva center.";
      setAnswer(fallback);
    } finally {
      setLoading(false);
    }
  }

  const selectedService = activeServices.find((s) => s.id === serviceId);

  const SAMPLE_QUESTIONS = [
    "What documents are required?",
    "How long does it take to process?",
    "Where do I apply?",
    "What are the common mistakes to avoid?",
    "What is the eligibility criteria?",
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* Page intro */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-[#1a3a5c] text-white px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Bot size={20} className="text-[#e07b00]" />
          </div>
          <div>
            <h2 className="font-black text-base">SevaSetu Help Desk</h2>
            <p className="text-gray-300 text-xs">
              Government service guidance — powered by verified Telangana service data
            </p>
          </div>
        </div>
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 flex items-start gap-2 text-xs text-blue-800">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          AI answers are based only on the selected service knowledge base. Please verify final details from official portals.
        </div>

        <div className="p-5 space-y-4">
          {/* Service selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Select Service
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c]"
              value={serviceId}
              onChange={(e) => { setServiceId(e.target.value); setAnswer(""); }}
            >
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Sample questions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Quick Questions
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="text-xs border border-gray-200 bg-gray-50 hover:border-[#1a3a5c] hover:bg-[#f0f4f9] text-gray-700 rounded px-3 py-1.5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Question input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Your Question
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c] resize-none"
              placeholder={`Ask about ${selectedService?.name || "this service"}... e.g. What documents are needed?`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleAsk(); }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">Ctrl+Enter to submit</span>
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="inline-flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-2 rounded transition-colors"
              >
                <Send size={14} />
                {loading ? "Processing..." : "Submit Query"}
              </button>
            </div>
          </div>

          {/* Answer */}
          {answer && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#2d7a4f] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <ShieldCheck size={12} /> Help Desk Response
              </div>
              <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-l-4 border-[#2d7a4f]">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Recent Questions</h3>
          <div className="space-y-3">
            {history.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-[#1a3a5c] mb-1 text-xs uppercase tracking-wide">
                  Q: {item.q}
                </p>
                <p className="text-gray-600 leading-relaxed text-xs line-clamp-3">{item.ans}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-800 leading-relaxed flex items-start gap-2">
        <Info size={13} className="flex-shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> SevaSetu AI Help Desk answers are based only on verified Telangana service data.
          For legal, policy, or financial decisions, always verify from the official government portal or contact your nearest MeeSeva centre.
          Helpline: <strong>1800-599-4788</strong>
        </span>
      </div>
    </div>
  );
}

export default function HelpDeskPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">AI Help Desk</span>
          </nav>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <HelpCircle size={22} /> SevaSetu Help Desk
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Ask questions about any Telangana government service. Answers are based only on verified official data.
          </p>
        </div>
      </div>
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Help Desk...</div>}>
          <HelpDeskContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
