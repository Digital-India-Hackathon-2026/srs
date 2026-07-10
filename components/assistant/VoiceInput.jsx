"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

const SUPPORTED_LANGS = [
  { code: "en-IN", label: "EN" },
  { code: "te-IN", label: "TE" },
  { code: "hi-IN", label: "HI" },
];

/**
 * VoiceInput
 * Props:
 *   onTranscript(text)   — called with final transcript
 *   disabled             — disables the mic button
 *   ttsEnabled           — whether TTS speaker is on
 *   onTtsToggle()        — toggle TTS on/off
 */
export default function VoiceInput({ onTranscript, disabled, ttsEnabled, onTtsToggle }) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [supported, setSupported] = useState(null); // null=checking, true/false
  const [langIdx, setLangIdx] = useState(0);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);

  // Detect browser support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    setIsRecording(false);
    setInterimText("");
  }, []);

  const startRecording = useCallback(() => {
    if (disabled) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = SUPPORTED_LANGS[langIdx].code;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
      setInterimText("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setInterimText(interimTranscript);

      // Reset silence timer on any speech
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => stopRecording(), 2500);

      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
        stopRecording();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognition.start();
  }, [disabled, langIdx, onTranscript, stopRecording]);

  const handleMicClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopRecording();
  }, [stopRecording]);

  if (supported === false) {
    return (
      <div
        title="Voice input is not supported in this browser"
        className="w-7 h-7 flex items-center justify-center opacity-30 cursor-not-allowed flex-shrink-0"
      >
        <MicOff size={14} className="text-gray-400" />
      </div>
    );
  }

  if (supported === null) return null; // still checking

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {/* Language cycle button — only show when not recording */}
      {!isRecording && (
        <button
          type="button"
          onClick={() => setLangIdx((i) => (i + 1) % SUPPORTED_LANGS.length)}
          className="text-[9px] font-bold text-gray-400 hover:text-[#163A63] transition-colors w-5 h-5 rounded flex items-center justify-center"
          title={`Voice language: ${SUPPORTED_LANGS[langIdx].label} — click to change`}
          aria-label="Change voice language"
        >
          {SUPPORTED_LANGS[langIdx].label}
        </button>
      )}

      {/* Listening label when recording */}
      {isRecording && interimText && (
        <span className="text-[10px] text-[#163A63] font-medium max-w-[80px] truncate animate-pulse">
          {interimText}
        </span>
      )}
      {isRecording && !interimText && (
        <span className="text-[10px] text-[#163A63] font-medium animate-pulse">
          Listening...
        </span>
      )}

      {/* Mic button */}
      <button
        type="button"
        onClick={handleMicClick}
        disabled={disabled}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
          isRecording
            ? "bg-red-500 text-white shadow-lg mic-pulse"
            : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#163A63]"
        } disabled:opacity-30 disabled:cursor-not-allowed`}
        title={isRecording ? "Stop recording" : "Start voice input"}
        aria-label={isRecording ? "Stop voice input" : "Start voice input"}
        aria-pressed={isRecording}
      >
        {isRecording ? (
          <span className="relative flex items-center justify-center">
            <Mic size={13} />
            {/* Waveform animation dots */}
            <span className="absolute -right-3 flex gap-[2px] items-end h-3">
              <span className="w-[2px] bg-red-400 rounded wave-bar" style={{ animationDelay: "0ms", height: "4px" }} />
              <span className="w-[2px] bg-red-400 rounded wave-bar" style={{ animationDelay: "150ms", height: "8px" }} />
              <span className="w-[2px] bg-red-400 rounded wave-bar" style={{ animationDelay: "300ms", height: "5px" }} />
              <span className="w-[2px] bg-red-400 rounded wave-bar" style={{ animationDelay: "100ms", height: "10px" }} />
              <span className="w-[2px] bg-red-400 rounded wave-bar" style={{ animationDelay: "250ms", height: "6px" }} />
            </span>
          </span>
        ) : (
          <Mic size={13} />
        )}
      </button>

      {/* TTS toggle */}
      <button
        type="button"
        onClick={onTtsToggle}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
          ttsEnabled
            ? "text-[#163A63] bg-[#163A63]/10"
            : "text-gray-300 hover:text-gray-400"
        }`}
        title={ttsEnabled ? "Disable spoken responses" : "Enable spoken responses"}
        aria-label={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
        aria-pressed={ttsEnabled}
      >
        {ttsEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
      </button>

      <style>{`
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
        }
        .mic-pulse {
          animation: micPulse 1s ease-in-out infinite;
        }
        @keyframes wavebar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.5); }
        }
        .wave-bar {
          animation: wavebar 0.6s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
    </div>
  );
}
