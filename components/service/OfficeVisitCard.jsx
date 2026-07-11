import { Clock } from "lucide-react";

/**
 * Recommended Time to Visit card.
 * Informational only — not live data.
 */
export default function OfficeVisitCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
        <Clock size={12} className="text-[#1a3a5c]" /> Recommended Time to Visit
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 p-2 bg-green-50 border border-green-100 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-green-800">Best Time</p>
            <p className="text-[11px] text-green-700">9:00 AM – 11:00 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2 bg-yellow-50 border border-yellow-100 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-yellow-800">Moderate</p>
            <p className="text-[11px] text-yellow-700">11:00 AM – 2:00 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2 bg-red-50 border border-red-100 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-800">Usually Busy</p>
            <p className="text-[11px] text-red-700">2:00 PM – 5:00 PM</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2.5 leading-relaxed">
        General recommendations based on typical office hours. May vary by location.
      </p>
    </div>
  );
}
