import { CheckCircle2, Lightbulb } from "lucide-react";
import { getServiceTips } from "../../lib/constants/serviceTips";

/**
 * Application Success Tips section — displayed at bottom of service detail pages.
 */
export default function ApplicationSuccessTips({ serviceId }) {
  const tips = getServiceTips(serviceId);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-[#2d7a4f] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
        <Lightbulb size={13} /> Application Success Tips
      </div>
      <div className="p-5">
        <p className="text-xs text-gray-500 mb-3">Follow these tips to improve your chances of a smooth, first-time approval.</p>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-[#2d7a4f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
