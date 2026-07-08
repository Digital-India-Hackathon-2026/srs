import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f2540] text-gray-400 text-xs mt-auto">
      <div className="border-t-4 border-[#e07b00]" />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid sm:grid-cols-3 gap-6 mb-6">

          {/* Brand block */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/sevasetu-logo.png"
                alt="SevaSetu Telangana"
                width={52}
                height={52}
                className="object-contain h-[52px] w-auto flex-shrink-0"
              />
              <div>
                <p className="text-white font-bold text-sm leading-tight">SevaSetu Telangana</p>
                <p className="text-gray-400 text-[11px] mt-0.5">Telangana Public Service Navigator</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              AI-powered multilingual guide for Telangana government services.
              Verified. Official. Trusted.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-semibold mb-2">Quick Links</p>
            <div className="space-y-1.5">
              <Link href="/services"  className="block hover:text-white transition-colors">All Services</Link>
              <Link href="/help-desk" className="block hover:text-white transition-colors">AI Help Desk</Link>
              <Link href="/offices"   className="block hover:text-white transition-colors">MeeSeva Offices</Link>
              <Link href="/about"     className="block hover:text-white transition-colors">About SevaSetu</Link>
            </div>
          </div>

          {/* Official portals */}
          <div>
            <p className="text-white font-semibold mb-2">Official Portals</p>
            <div className="space-y-1.5">
              <a href="https://tg.meeseva.gov.in"      target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">MeeSeva Portal</a>
              <a href="https://telangana.gov.in"        target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Telangana Government</a>
              <a href="https://cdma.telangana.gov.in"   target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">CDMA Telangana</a>
              <a href="https://www.ghmc.gov.in"         target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">GHMC</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <p className="text-yellow-300/80 font-medium">
            Disclaimer: SevaSetu is a student-built guidance platform. Users must verify
            final information on official government portals before taking action.
          </p>
          <div className="flex flex-wrap gap-4 justify-between text-gray-500">
            <span>© 2026 SevaSetu Telangana. Built for Telangana Hackathon.</span>
            <span>Data sourced from official Telangana government portals. Last verified: July 2026.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
