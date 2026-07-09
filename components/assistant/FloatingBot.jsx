"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import SevasetuMascot from "./SevasetuMascot";

const SPEECH_BUBBLES = [
  "Need help with government services?",
  "Ask me anything!",
  "Passport? Aadhaar? I'm here!",
  "Hi! Need assistance?",
  "I can help with Telangana services.",
  "Documents? Fees? Steps? Just ask!",
];

export default function FloatingBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mascotState, setMascotState] = useState("idle");
  const [speechBubble, setSpeechBubble] = useState("");
  const [showBubble, setShowBubble] = useState(true);
  const bubbleIndex = useRef(0);
  const bubbleTimer = useRef(null);

  // Rotate speech bubble text every 8 seconds — bubble always visible
  useEffect(() => {
    setSpeechBubble(SPEECH_BUBBLES[0]);

    bubbleTimer.current = setInterval(() => {
      bubbleIndex.current = (bubbleIndex.current + 1) % SPEECH_BUBBLES.length;
      setSpeechBubble(SPEECH_BUBBLES[bubbleIndex.current]);
    }, 8000);

    return () => clearInterval(bubbleTimer.current);
  }, []);

  // Hide bubble when chat opens
  useEffect(() => {
    if (open) setShowBubble(false);
  }, [open]);

  const handleOpen = useCallback(() => {
    setShowBubble(false);
    setMascotState("click");
    setTimeout(() => {
      setOpen(true);
      setMinimized(false);
      setMascotState("happy");
      setTimeout(() => setMascotState("idle"), 1200);
    }, 250);
  }, []);

  function handleClose() {
    setOpen(false);
    setMinimized(false);
    setMascotState("idle");
  }

  function handleMinimize() {
    setMinimized(true);
    setOpen(false);
    setMascotState("idle");
  }

  function handleChatState(newState) {
    setMascotState(newState);
  }

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed z-50 shadow-2xl rounded-xl overflow-hidden flex flex-col border border-gray-200/80"
          style={{
            bottom: "108px",
            right: "16px",
            width: "min(380px, calc(100vw - 32px))",
            height: "min(560px, calc(100dvh - 140px))",
          }}
        >
          <ChatWindow
            onMinimize={handleMinimize}
            onClose={handleClose}
            onStateChange={handleChatState}
          />
        </div>
      )}

      {/* ── Floating area ── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">

        {/* Speech bubble */}
        {showBubble && !open && (
          <div
            className="speech-bubble bg-white text-[#163A63] text-xs font-medium px-3 py-2 rounded-xl shadow-lg border border-gray-100 relative max-w-[180px] leading-relaxed"
            onClick={handleOpen}
            style={{ cursor: "pointer" }}
          >
            {speechBubble}
            <div className="absolute bottom-[-5px] right-8 w-2.5 h-2.5 bg-white border-r border-b border-gray-100 rotate-45" />
          </div>
        )}

        {/* Minimized pill */}
        {minimized && !open && (
          <button
            onClick={handleOpen}
            className="bg-white text-[#163A63] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-gray-200 flex items-center gap-1.5 hover:shadow-xl transition-shadow mb-1"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SevaSetu AI
          </button>
        )}

        {/* Mascot / Close button */}
        <button
          onClick={open ? handleClose : handleOpen}
          onMouseEnter={() => { if (!open) { setHovered(true); setMascotState("hover"); } }}
          onMouseLeave={() => { setHovered(false); if (!open) setMascotState("idle"); }}
          className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A2B] rounded-full"
          aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {open ? (
            <div className="w-12 h-12 rounded-full bg-[#163A63] border-2 border-[#C89A2B]/60 flex items-center justify-center shadow-xl hover:bg-[#1a4a7a] transition-colors">
              <X size={20} className="text-white" />
            </div>
          ) : (
            <SevasetuMascot state={mascotState} size={hovered ? 82 : 75} />
          )}
        </button>
      </div>

      <style>{`
        .speech-bubble {
          animation: bubbleFadeIn 0.3s ease-out;
        }
        @keyframes bubbleFadeIn {
          from { opacity: 0; transform: translateY(6px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
