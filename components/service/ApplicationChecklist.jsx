"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Download, AlertCircle } from "lucide-react";
import { getServiceTips } from "../../lib/constants/serviceTips";

/**
 * Interactive Application Checklist component.
 * - Shows every required document as a checkable item.
 * - Tracks checked state locally.
 * - Computes readiness score and shows Ready / Missing status.
 * - Download button generates a printable PDF checklist.
 */
export default function ApplicationChecklist({
  service,
  docs = [],
  elig = [],
  processingTime,
  fees,
  whereToApply,
  // optional: pre-checked doc labels (e.g. from Draft Generator uploads)
  uploadedDocs = [],
}) {
  // normalise for comparison
  const normalise = (s) => (s || "").toLowerCase().trim();

  // Initialise checked state: auto-check anything that matches an uploaded doc
  const [checked, setChecked] = useState(() => {
    const initial = {};
    docs.forEach((doc) => {
      const isUploaded = uploadedDocs.some(
        (u) => normalise(u).includes(normalise(doc)) || normalise(doc).includes(normalise(u))
      );
      initial[doc] = isUploaded;
    });
    return initial;
  });

  // Re-sync if uploadedDocs prop changes (e.g. after Draft Generator extraction)
  useEffect(() => {
    if (!uploadedDocs.length) return;
    setChecked((prev) => {
      const next = { ...prev };
      docs.forEach((doc) => {
        const isUploaded = uploadedDocs.some(
          (u) => normalise(u).includes(normalise(doc)) || normalise(doc).includes(normalise(u))
        );
        if (isUploaded) next[doc] = true;
      });
      return next;
    });
  }, [uploadedDocs.join(",")]); // eslint-disable-line

  function toggle(doc) {
    setChecked((prev) => ({ ...prev, [doc]: !prev[doc] }));
  }

  const total = docs.length;
  const checkedCount = docs.filter((d) => checked[d]).length;
  const pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
  const isReady = checkedCount === total && total > 0;
  const missing = docs.filter((d) => !checked[d]);

  // PDF download
  function handleDownload() {
    const tips = getServiceTips(service?.id);
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${service?.name || "Application"} — Application Checklist</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#1a2733;padding:32px;max-width:680px;margin:auto}
    .header{border-bottom:3px solid #1a3a5c;padding-bottom:12px;margin-bottom:18px}
    .brand{font-size:11px;font-weight:bold;color:#1a3a5c;letter-spacing:1px;text-transform:uppercase}
    h1{font-size:20px;color:#1a3a5c;margin:6px 0 2px}
    .subtitle{font-size:11px;color:#666}
    .section{margin-bottom:16px}
    .section-title{background:#1a3a5c;color:white;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;padding:5px 10px;border-radius:4px 4px 0 0}
    .section-body{border:1px solid #ddd;border-top:none;border-radius:0 0 4px 4px;padding:10px 12px}
    .item{display:flex;align-items:flex-start;gap:8px;padding:4px 0;border-bottom:1px solid #f0f0f0}
    .item:last-child{border-bottom:none}
    .check{color:#2d7a4f;font-weight:bold;font-size:13px;flex-shrink:0}
    .tip-check{color:#e07b00;font-weight:bold;font-size:13px;flex-shrink:0}
    .meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .meta-item{background:#f8f9fa;border:1px solid #e9ecef;border-radius:4px;padding:8px}
    .meta-label{font-size:9px;color:#999;text-transform:uppercase;font-weight:bold}
    .meta-value{font-size:11px;color:#1a3a5c;font-weight:bold;margin-top:2px}
    .disclaimer{margin-top:20px;padding:10px;background:#fff9e6;border:1px solid #f5d8a0;border-radius:4px;font-size:10px;color:#7a4a00}
    .footer{margin-top:16px;text-align:center;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:10px}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">SevaSetu Telangana</div>
    <h1>${service?.name || "Application"} Checklist</h1>
    <div class="subtitle">AI-Powered Government Service Navigator · Generated ${new Date().toLocaleDateString("en-IN")}</div>
  </div>

  <div class="section">
    <div class="section-title">Required Documents</div>
    <div class="section-body">
      ${docs.length > 0 ? docs.map((doc) => `<div class="item"><span class="check">${checked[doc] ? "☑" : "☐"}</span><span>${doc}</span></div>`).join("") : "<p style='color:#999;font-size:11px'>See official portal for document requirements.</p>"}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Service Details</div>
    <div class="section-body">
      <div class="meta-grid">
        <div class="meta-item"><div class="meta-label">Processing Time</div><div class="meta-value">${processingTime || "See portal"}</div></div>
        <div class="meta-item"><div class="meta-label">Application Fee</div><div class="meta-value">${fees || "See portal"}</div></div>
        <div class="meta-item"><div class="meta-label">Where to Apply</div><div class="meta-value">${whereToApply || "See portal"}</div></div>
        <div class="meta-item"><div class="meta-label">Official Portal</div><div class="meta-value" style="word-break:break-all;font-size:10px">${service?.officialLink || "See portal"}</div></div>
      </div>
    </div>
  </div>

  ${elig && elig.length > 0 ? `<div class="section"><div class="section-title">Eligibility</div><div class="section-body">${elig.map((e) => `<div class="item"><span class="check">✓</span><span>${e}</span></div>`).join("")}</div></div>` : ""}

  <div class="section">
    <div class="section-title">Application Tips</div>
    <div class="section-body">
      ${tips.map((tip) => `<div class="item"><span class="tip-check">★</span><span>${tip}</span></div>`).join("")}
    </div>
  </div>

  <div class="disclaimer"><strong>Disclaimer:</strong> This checklist is for guidance purposes only. Always verify the final requirements on the official government portal before applying. SevaSetu is not affiliated with any government department.</div>
  <div class="footer">Generated by SevaSetu AI · For guidance only</div>
</body>
</html>`;
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }

  if (total === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
        Application Checklist
      </div>

      <div className="p-4 space-y-3">
        {/* Document checkboxes */}
        <div className="space-y-1.5">
          {docs.map((doc) => {
            const isChecked = !!checked[doc];
            return (
              <button
                key={doc}
                type="button"
                onClick={() => toggle(doc)}
                className={`w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg border transition-colors ${
                  isChecked
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 size={15} className="text-[#2d7a4f] flex-shrink-0" />
                ) : (
                  <Circle size={15} className="text-gray-300 flex-shrink-0" />
                )}
                <span className="text-xs font-medium leading-snug">{doc}</span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Application Readiness</span>
            <span className={`text-xs font-bold ${isReady ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-500"}`}>
              {pct}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isReady ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {checkedCount} of {total} documents ready
          </p>
        </div>

        {/* Status */}
        {isReady ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
            <span className="text-xs font-bold text-green-700">Ready to Apply</span>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />
              <span className="text-xs font-bold text-orange-700">Missing Documents</span>
            </div>
            <ul className="pl-5 space-y-0.5">
              {missing.map((doc) => (
                <li key={doc} className="text-[11px] text-orange-700 list-disc leading-snug">{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="w-full inline-flex items-center justify-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white text-xs font-bold px-4 py-2 rounded transition-colors"
          aria-label={`Download ${service?.name} checklist PDF`}
        >
          <Download size={12} /> Download Checklist PDF
        </button>
      </div>
    </div>
  );
}
