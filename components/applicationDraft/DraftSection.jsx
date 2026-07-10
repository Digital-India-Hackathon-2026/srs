"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import DraftField from "./DraftField";

/**
 * DraftSection — a collapsible section grouping related fields.
 *
 * Props:
 *   stepName    — section heading (e.g., "Personal Details")
 *   stepIndex   — section number (0-based)
 *   fields      — array of { label, value, filled, required, ocrFilled }
 *   onFieldChange — callback(fieldIndex, newValue)
 */
export default function DraftSection({ stepName, stepIndex, fields, onFieldChange }) {
  const [expanded, setExpanded] = useState(true);

  const totalFields = fields.length;
  const filledFields = fields.filter((f) => f.value && f.value !== "—").length;
  const missingRequired = fields.filter((f) => f.required && (!f.value || f.value === "—")).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Section header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {/* Step number badge */}
          <div className="w-6 h-6 rounded-full bg-[#163A63] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            {stepIndex + 1}
          </div>
          <div>
            <span className="text-sm font-bold text-[#163A63]">{stepName}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400">
                {filledFields}/{totalFields} filled
              </span>
              {missingRequired > 0 && (
                <span className="text-[10px] text-red-500 font-semibold">
                  {missingRequired} required missing
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand/collapse icon */}
        {expanded ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
      </button>

      {/* Fields */}
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5 border-t border-gray-100 pt-2">
          {fields.map((field, i) => (
            <DraftField
              key={i}
              label={field.label}
              value={field.value === "—" ? "" : field.value}
              filled={!!field.value && field.value !== "—"}
              required={field.required}
              ocrFilled={field.filled && field.value && field.value !== "—"}
              onChange={(newVal) => onFieldChange && onFieldChange(i, newVal)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
