"use client";
import { useState } from "react";
import { Info } from "lucide-react";
import { getDocumentReason } from "../../lib/constants/documentReasons";

/**
 * Inline ⓘ icon with tooltip explaining why a document is required.
 * Works on both hover (desktop) and click (mobile).
 */
export default function DocumentTooltip({ documentLabel, className = "" }) {
  const [visible, setVisible] = useState(false);
  const reason = getDocumentReason(documentLabel);

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        aria-label={`Why is ${documentLabel} required?`}
        onClick={() => setVisible(v => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="ml-1 text-gray-400 hover:text-[#1a3a5c] focus:outline-none focus:text-[#1a3a5c] transition-colors"
      >
        <Info size={13} />
      </button>

      {visible && (
        <span
          role="tooltip"
          className="absolute z-50 left-6 top-0 w-56 bg-[#1a2733] text-white text-[11px] leading-relaxed rounded-lg px-3 py-2 shadow-xl pointer-events-none"
        >
          <span className="block font-semibold text-[#C89A2B] mb-0.5">Why needed?</span>
          {reason}
          <span className="absolute -left-1.5 top-2 border-4 border-transparent border-r-[#1a2733]" />
        </span>
      )}
    </span>
  );
}
