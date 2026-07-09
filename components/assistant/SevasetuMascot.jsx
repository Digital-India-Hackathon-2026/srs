"use client";

import { useEffect, useState } from "react";

/**
 * SevaSetu AI Mascot — Custom animated robot
 * Navy (#163A63), Gold (#C89A2B), Green (#2E8B57), White body
 * Pure SVG + CSS keyframes for 60fps performance
 */

export default function SevasetuMascot({ state = "idle", size = 80 }) {
  const [blink, setBlink] = useState(false);

  // Blink every 3-5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const eyeHeight = blink ? 1 : 6;
  const eyeY = blink ? 34 : 31;

  // Eye position shifts for thinking state
  const eyeOffsetX = state === "thinking" ? 2 : 0;
  const eyeOffsetY = state === "thinking" ? -2 : 0;

  // Mouth shape
  const mouthPath = state === "happy"
    ? "M 34 42 Q 40 48 46 42" // big smile
    : state === "thinking"
    ? "M 36 43 Q 40 44 44 43" // small neutral
    : "M 35 42 Q 40 46 45 42"; // normal smile

  return (
    <div
      className={`mascot-container mascot-${state}`}
      style={{ width: size, height: size + 20 }}
    >
      <svg
        viewBox="0 0 80 100"
        width={size}
        height={size + 20}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mascot-svg"
      >
        {/* ── Antenna ─────────────────────────────────────────── */}
        <line x1="40" y1="12" x2="40" y2="5" stroke="#163A63" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="4" r="3" className="antenna-glow">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* ── Head ────────────────────────────────────────────── */}
        <rect x="24" y="12" width="32" height="28" rx="10" fill="white" stroke="#163A63" strokeWidth="2" />
        {/* Forehead gold accent */}
        <rect x="32" y="13" width="16" height="3" rx="1.5" fill="#C89A2B" opacity="0.8" />

        {/* ── Eyes ────────────────────────────────────────────── */}
        <ellipse cx={34 + eyeOffsetX} cy={eyeY + eyeOffsetY} rx="4" ry={eyeHeight} fill="#163A63" className="eye-left">
          {state === "thinking" && (
            <animate attributeName="cx" values="34;36;32;34" dur="2s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx={46 + eyeOffsetX} cy={eyeY + eyeOffsetY} rx="4" ry={eyeHeight} fill="#163A63" className="eye-right">
          {state === "thinking" && (
            <animate attributeName="cx" values="46;48;44;46" dur="2s" repeatCount="indefinite" />
          )}
        </ellipse>
        {/* Eye glow (subtle) */}
        <ellipse cx="34" cy="30" rx="1.5" ry="1" fill="white" opacity="0.6" />
        <ellipse cx="46" cy="30" rx="1.5" ry="1" fill="white" opacity="0.6" />

        {/* ── Mouth ───────────────────────────────────────────── */}
        <path d={mouthPath} stroke="#163A63" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* ── Body ────────────────────────────────────────────── */}
        <rect x="26" y="42" width="28" height="30" rx="8" fill="white" stroke="#163A63" strokeWidth="2" />
        {/* Chest badge — SevaSetu green accent */}
        <circle cx="40" cy="52" r="5" fill="#2E8B57" opacity="0.9" />
        <path d="M38 52 L39.5 53.5 L43 50" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Gold belt line */}
        <rect x="28" y="62" width="24" height="2.5" rx="1" fill="#C89A2B" opacity="0.7" />

        {/* ── Left Hand ───────────────────────────────────────── */}
        <g className={`hand-left hand-${state}`}>
          <circle cx="20" cy="52" r="5" fill="white" stroke="#163A63" strokeWidth="1.5" />
          <circle cx="20" cy="52" r="2" fill="#C89A2B" opacity="0.5" />
        </g>

        {/* ── Right Hand ──────────────────────────────────────── */}
        <g className={`hand-right hand-${state}`}>
          <circle cx="60" cy="52" r="5" fill="white" stroke="#163A63" strokeWidth="1.5" />
          <circle cx="60" cy="52" r="2" fill="#C89A2B" opacity="0.5" />
        </g>

        {/* ── Left Leg ────────────────────────────────────────── */}
        <g className="leg-left">
          <rect x="32" y="72" width="6" height="12" rx="3" fill="white" stroke="#163A63" strokeWidth="1.5" />
          <ellipse cx="35" cy="85" rx="5" ry="3" fill="#163A63" opacity="0.8" />
        </g>

        {/* ── Right Leg ───────────────────────────────────────── */}
        <g className="leg-right">
          <rect x="42" y="72" width="6" height="12" rx="3" fill="white" stroke="#163A63" strokeWidth="1.5" />
          <ellipse cx="45" cy="85" rx="5" ry="3" fill="#163A63" opacity="0.8" />
        </g>

        {/* ── Shadow ──────────────────────────────────────────── */}
        <ellipse cx="40" cy="92" rx="14" ry="3" fill="#163A63" opacity="0.12" className="shadow-blob" />

        {/* ── Sparkles (happy state) ──────────────────────────── */}
        {state === "happy" && (
          <>
            <circle cx="16" cy="22" r="1.5" fill="#C89A2B" className="sparkle sparkle-1" />
            <circle cx="64" cy="18" r="1.5" fill="#C89A2B" className="sparkle sparkle-2" />
            <circle cx="12" cy="40" r="1" fill="#2E8B57" className="sparkle sparkle-3" />
            <circle cx="68" cy="38" r="1" fill="#2E8B57" className="sparkle sparkle-4" />
          </>
        )}

        {/* ── Thinking dots ───────────────────────────────────── */}
        {state === "thinking" && (
          <>
            <circle cx="52" cy="16" r="2" fill="#163A63" opacity="0.6" className="think-dot-1" />
            <circle cx="58" cy="12" r="1.5" fill="#163A63" opacity="0.4" className="think-dot-2" />
            <circle cx="62" cy="8" r="1" fill="#163A63" opacity="0.3" className="think-dot-3" />
          </>
        )}
      </svg>

      <style>{`
        .mascot-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Float animation (idle) ── */
        .mascot-idle .mascot-svg {
          animation: mascotFloat 3s ease-in-out infinite;
        }
        .mascot-hover .mascot-svg {
          animation: mascotFloat 2s ease-in-out infinite;
        }

        @keyframes mascotFloat {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-7px); }
          100% { transform: translateY(0px); }
        }

        /* ── Breathing (body subtle scale) ── */
        .mascot-idle .mascot-svg,
        .mascot-hover .mascot-svg {
          animation: mascotFloat 3s ease-in-out infinite, mascotBreathe 4s ease-in-out infinite;
        }

        @keyframes mascotBreathe {
          0%   { transform: translateY(0) scale(1); }
          50%  { transform: translateY(-7px) scale(1.015); }
          100% { transform: translateY(0) scale(1); }
        }

        /* ── Antenna glow ── */
        .antenna-glow {
          fill: #C89A2B;
          filter: drop-shadow(0 0 3px #C89A2B);
        }
        .mascot-thinking .antenna-glow {
          fill: #2E8B57;
          filter: drop-shadow(0 0 5px #2E8B57);
        }

        /* ── Hand animations ── */
        .hand-left { transform-origin: 20px 52px; }
        .hand-right { transform-origin: 60px 52px; }

        .hand-idle {
          animation: handIdle 4s ease-in-out infinite;
        }
        .hand-hover {
          animation: handWave 0.8s ease-in-out 3;
        }
        .hand-happy {
          animation: handCelebrate 0.6s ease-in-out infinite;
        }
        .hand-thinking {
          animation: handThink 2s ease-in-out infinite;
        }

        @keyframes handIdle {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(3deg) translateY(-1px); }
        }
        @keyframes handWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg) translateY(-3px); }
          75% { transform: rotate(15deg) translateY(-2px); }
        }
        @keyframes handCelebrate {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-10deg) translateY(-4px); }
          75% { transform: rotate(10deg) translateY(-4px); }
        }
        @keyframes handThink {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(5deg) translateY(-2px); }
        }

        /* ── Leg animations ── */
        .leg-left { transform-origin: 35px 72px; }
        .leg-right { transform-origin: 45px 72px; }

        .mascot-idle .leg-left {
          animation: legBounce 3s ease-in-out infinite;
        }
        .mascot-idle .leg-right {
          animation: legBounce 3s ease-in-out infinite 0.3s;
        }

        @keyframes legBounce {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-1px) rotate(2deg); }
        }

        /* ── Shadow pulse ── */
        .shadow-blob {
          animation: shadowPulse 3s ease-in-out infinite;
        }
        @keyframes shadowPulse {
          0%, 100% { rx: 14; opacity: 0.12; }
          50% { rx: 12; opacity: 0.08; }
        }

        /* ── Sparkles ── */
        .sparkle { animation: sparkleAnim 1.2s ease-in-out infinite; }
        .sparkle-1 { animation-delay: 0s; }
        .sparkle-2 { animation-delay: 0.3s; }
        .sparkle-3 { animation-delay: 0.6s; }
        .sparkle-4 { animation-delay: 0.9s; }
        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        /* ── Thinking dots ── */
        .think-dot-1 { animation: thinkPop 1.5s ease-in-out infinite; }
        .think-dot-2 { animation: thinkPop 1.5s ease-in-out infinite 0.3s; }
        .think-dot-3 { animation: thinkPop 1.5s ease-in-out infinite 0.6s; }
        @keyframes thinkPop {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }

        /* ── Jump on click ── */
        .mascot-click .mascot-svg {
          animation: mascotJump 0.4s ease-out;
        }
        @keyframes mascotJump {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-12px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }

        /* ── Head tilt (idle) ── */
        .mascot-idle .mascot-svg {
          animation: mascotBreathe 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
