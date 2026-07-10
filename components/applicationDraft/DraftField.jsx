"use client";

import { useState } from "react";
import { Check, ClipboardCopy, Pencil } from "lucide-react";

/**
 * DraftField — a single editable field with copy button.
 *
 * Props:
 *   label       — field label
 *   value       — current value
 *   filled      — whether OCR or user filled this
 *   required    — is this mandatory
 *   ocrFilled   — was this auto-filled by OCR
 *   onChange    — callback(newValue)
 */
export default function DraftField({ label, value, filled, required, ocrFilled, onChange }) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!localValue) return;
    navigator.clipboard.writeText(localValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleBlur() {
    setEditing(false);
    if (onChange && localValue !== value) {
      onChange(localValue);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.target.blur();
    }
  }

  const isMissing = required && !localValue;

  return (
    <div
      className={`flex items-center gap-2 py-2 px-3 rounded-lg border transition-all ${
        isMissing
          ? "border-red-200 bg-red-50/50"
          : ocrFilled
          ? "border-green-200 bg-green-50/40"
          : "border-gray-100 bg-white"
      }`}
    >
      {/* Label + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
            {label}
          </span>
          {required && <span className="text-[9px] text-red-500 font-bold">*</span>}
          {ocrFilled && !isMissing && (
            <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 py-0.5 rounded">
              OCR
            </span>
          )}
          {isMissing && (
            <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1 py-0.5 rounded">
              Missing
            </span>
          )}
        </div>

        {/* Editable value */}
        {editing ? (
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full text-sm text-gray-800 bg-white border border-[#163A63] rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#163A63]"
          />
        ) : (
          <p
            className={`text-sm truncate ${
              localValue ? "text-gray-800 font-medium" : "text-gray-300 italic"
            }`}
          >
            {localValue || "Not filled"}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {/* Edit */}
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-gray-400 hover:text-[#163A63] rounded transition-colors"
          title="Edit field"
          aria-label={`Edit ${label}`}
        >
          <Pencil size={12} />
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          disabled={!localValue}
          className="p-1.5 text-gray-400 hover:text-[#163A63] disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
          title="Copy value"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={12} className="text-green-600" /> : <ClipboardCopy size={12} />}
        </button>
      </div>
    </div>
  );
}
