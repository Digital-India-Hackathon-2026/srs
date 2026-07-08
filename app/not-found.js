import Link from "next/link";
import { FileText, Home } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div>
          <div className="text-6xl font-black text-[#1a3a5c] opacity-20 mb-4">404</div>
          <h1 className="text-xl font-black text-[#1a3a5c] mb-2">Page Not Found</h1>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white font-bold px-4 py-2 rounded text-sm hover:bg-[#0f2540] transition-colors">
              <Home size={14} /> Go to Home
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] font-bold px-4 py-2 rounded text-sm hover:bg-[#1a3a5c] hover:text-white transition-colors">
              <FileText size={14} /> Browse Services
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
